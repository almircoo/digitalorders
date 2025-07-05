from rest_framework import serializers
from django.contrib.auth import authenticate, password_validation
from django.db import transaction
from django.utils import timezone
from django.conf import settings # Import settings for accessing site URL for email links

from .models import User, RestaurantProfile, ProviderProfile, UserProfile, EmailVerificationToken, PasswordResetToken


# --- Existing Serializers (with slight modifications for email verification) ---

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'address', 'city', 'country', 'zip_code', 'is_email_verified',
            'email_verified_at', 'latitude', 'longitude', 'last_known_ip',
            'location_updated_at'
        ]
        read_only_fields = [
            'is_email_verified', 'email_verified_at', 'last_known_ip',
            'location_updated_at'
        ]


class RestaurantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'modified_at']


class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'modified_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    restaurant_profile = RestaurantProfileSerializer(required=False)
    provider_profile = ProviderProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role', 'password', 'password2',
            'restaurant_profile', 'provider_profile'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        # Validate password strength based on Django's default validators
        try:
            password_validation.validate_password(data['password'])
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        role = data.get('role')
        restaurant_profile_data = data.get('restaurant_profile')
        provider_profile_data = data.get('provider_profile')

        if role == User.RESTAURANT and not restaurant_profile_data:
            raise serializers.ValidationError(
                {"restaurant_profile": "Restaurant profile data is required for Restaurant role."}
            )
        if role == User.PROVIDER and not provider_profile_data:
            raise serializers.ValidationError(
                {"provider_profile": "Provider profile data is required for Provider role."}
            )
        if role == User.SUPERUSER and (restaurant_profile_data or provider_profile_data):
            raise serializers.ValidationError(
                {"role": "Admin users should not provide profile data."}
            )

        if role not in [User.RESTAURANT, User.PROVIDER, User.SUPERUSER]:
            raise serializers.ValidationError({"role": "Invalid role specified."})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        restaurant_profile_data = validated_data.pop('restaurant_profile', None)
        provider_profile_data = validated_data.pop('provider_profile', None)
        role = validated_data.get('role')

        try:
            with transaction.atomic():
                # User is created with is_active=False by default (as defined in your model)
                user = User.objects.create_user(
                    email=validated_data['email'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'],
                    password=validated_data['password'],
                    role=role,
                    is_active=False # Explicitly set, but already default in model
                )

                UserProfile.objects.create(user=user)

                if role == User.RESTAURANT and restaurant_profile_data:
                    RestaurantProfile.objects.create(user=user, **restaurant_profile_data)
                elif role == User.PROVIDER and provider_profile_data:
                    ProviderProfile.objects.create(user=user, **provider_profile_data)

                return user
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Error during user creation: {e}"})


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    role = serializers.IntegerField()
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if role not in [User.RESTAURANT, User.PROVIDER]:
            raise serializers.ValidationError('Invalid role.')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password, role=role)
            if not user:
                raise serializers.ValidationError('Invalid login credentials.')
            # Crucial check: User must be active (email verified) to log in
            if not user.is_active:
                raise serializers.ValidationError('Account is not active. Please verify your email.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    restaurant = RestaurantProfileSerializer(read_only=True)
    provider = ProviderProfileSerializer(read_only=True)
    user_profile = UserProfileSerializer(read_only=True, source='userprofile') # Use source to link to related_name

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'full_name',
            'date_joined', 'last_login', 'is_active', 'is_admin', 'is_staff',
            'restaurant', 'provider', 'user_profile'
        ]
        read_only_fields = [
            'id', 'email', 'full_name', 'date_joined', 'last_login', 'is_active',
            'is_admin', 'is_staff'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.role == User.RESTAURANT:
            representation.pop('provider', None)
        elif instance.role == User.PROVIDER:
            representation.pop('restaurant', None)
        else:
            representation.pop('restaurant', None)
            representation.pop('provider', None)
        return representation

# --- New Serializers for Email Verification and Password Management ---

class EmailVerificationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_active:
                raise serializers.ValidationError("This email is already verified and active.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value


class EmailVerificationConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

    def validate_token(self, value):
        try:
            token_obj = EmailVerificationToken.objects.get(token=value)
        except EmailVerificationToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired verification token.")

        if not token_obj.is_valid():
            raise serializers.ValidationError("Invalid or expired verification token.")

        if token_obj.is_used:
            raise serializers.ValidationError("This verification token has already been used.")

        self.token_obj = token_obj # Store for later use in save()
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            # Only allow reset for active users
            if not user.is_active:
                raise serializers.ValidationError("Account is not active. Please verify your email first.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})

        try:
            password_validation.validate_password(data['new_password'])
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        try:
            token_obj = PasswordResetToken.objects.get(token=data['token'])
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired reset token.")

        if not token_obj.is_valid():
            raise serializers.ValidationError("Invalid or expired reset token.")

        if token_obj.is_used:
            raise serializers.ValidationError("This reset token has already been used.")

        self.token_obj = token_obj # Store for later use
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is not correct."})

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})

        try:
            password_validation.validate_password(data['new_password'], user=user)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return data
