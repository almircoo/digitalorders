from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import transaction
from django.conf import settings
from django.urls import reverse
from django.template.loader import render_to_string # If you want to render HTML emails
from django.core.mail import send_mail # For sending actual emails
from django.utils import timezone
from django.shortcuts import get_object_or_404 # Helper for retrieving objects or raising 404

from .models import User, RestaurantProfile, ProviderProfile, UserProfile, EmailVerificationToken, PasswordResetToken
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    RestaurantProfileSerializer,
    ProviderProfileSerializer,
    UserProfileSerializer,
    EmailVerificationRequestSerializer,
    EmailVerificationConfirmSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ChangePasswordSerializer
)
from .services import EmailService

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create an email verification token and send email
        email_token = EmailVerificationToken.objects.create(user=user)
        email_service = EmailService()
        success, response = email_service.send_verification_email(user, email_token)
        # send_verification_email(user, email_token)

        return Response({
            "message": "User registered successfully. Please check your email to activate your account.",
            'email_sent': success,
            "user_id": user.id,
            "email": user.email,
            'role': user.role,
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            # Update User fields if present in request data
            user_data = {
                k: v for k, v in request.data.items()
                if k in ['first_name', 'last_name'] # email is unique, handle with caution or separate flow
            }
            for attr, value in user_data.items():
                setattr(instance, attr, value)
            instance.save()

            # Update UserProfile
            if 'user_profile' in request.data:
                user_profile_data = request.data['user_profile']
                user_profile, created = UserProfile.objects.get_or_create(user=instance) # Use get_or_create for robustness
                user_profile_serializer = UserProfileSerializer(
                    user_profile, data=user_profile_data, partial=True
                )
                user_profile_serializer.is_valid(raise_exception=True)
                user_profile_serializer.save()

            # Update RestaurantProfile or ProviderProfile based on role
            if instance.role == User.RESTAURANT and 'restaurant_profile' in request.data:
                restaurant_profile_data = request.data['restaurant_profile']
                restaurant_profile_instance, created = RestaurantProfile.objects.get_or_create(user=instance)
                restaurant_serializer = RestaurantProfileSerializer(
                    restaurant_profile_instance, data=restaurant_profile_data, partial=True
                )
                restaurant_serializer.is_valid(raise_exception=True)
                restaurant_serializer.save()

            elif instance.role == User.PROVIDER and 'provider_profile' in request.data:
                provider_profile_data = request.data['provider_profile']
                provider_profile_instance, created = ProviderProfile.objects.get_or_create(user=instance)
                provider_serializer = ProviderProfileSerializer(
                    provider_profile_instance, data=provider_profile_data, partial=True
                )
                provider_serializer.is_valid(raise_exception=True)
                provider_serializer.save()

        return Response(UserSerializer(instance).data, status=status.HTTP_200_OK)


class EmailVerificationRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = EmailVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = User.objects.get(email=email)

        # Invalidate existing unused tokens for this user to avoid multiple valid tokens
        EmailVerificationToken.objects.filter(user=user, is_used=False, expires_at__gt=timezone.now()).update(is_used=True)

        email_token = EmailVerificationToken.objects.create(user=user)
        email_service = EmailService()
        success, response = email_service.send_verification_email(user, email_token)
                
        # send_verification_email(user, email_token)

        return Response(
            {
                "message": "Verification email sent. Please check your inbox.",
                'email_sent': success,
            },
            status=status.HTTP_200_OK
        )


class EmailVerificationConfirmView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Allow GET requests for email links (common practice)
        token = request.query_params.get('token')
        if not token:
            return Response({"detail": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = EmailVerificationConfirmSerializer(data={'token': token})
        try:
            serializer.is_valid(raise_exception=True)
            token_obj = serializer.token_obj # Access the stored token object
        except serializer.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = token_obj.user
            user.is_active = True
            user.save()

            # Mark UserProfile as email verified
            user_profile = user.userprofile
            user_profile.is_email_verified = True
            user_profile.email_verified_at = timezone.now()
            user_profile.save()

            token_obj.is_used = True
            token_obj.save()

        return Response(
            {"message": "Email successfully verified and account activated."},
            status=status.HTTP_200_OK
        )

    def post(self, request, *args, **kwargs):
        # Also allow POST for consistency if frontend prefers sending token in body
        serializer = EmailVerificationConfirmSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            token_obj = serializer.token_obj
        except serializer.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = token_obj.user
            user.is_active = True
            user.save()

            user_profile = user.userprofile
            user_profile.is_email_verified = True
            user_profile.email_verified_at = timezone.now()
            user_profile.save()

            token_obj.is_used = True
            token_obj.save()

        return Response(
            {"message": "Email successfully verified and account activated."},
            status=status.HTTP_200_OK
        )


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = User.objects.get(email=email)

        # Invalidate existing unused tokens for this user
        PasswordResetToken.objects.filter(user=user, is_used=False, expires_at__gt=timezone.now()).update(is_used=True)

        reset_token = PasswordResetToken.objects.create(user=user)
        # send_password_reset_email(user, reset_token)
        email_service = EmailService()
        success, response = email_service.send_password_reset_email(user, reset_token)
                
        print(success)
        return Response(
            {"message": "Password reset link sent to your email.", 
             'email_sent': success,
            },
            
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            token_obj = serializer.token_obj
        except serializer.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = token_obj.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            token_obj.is_used = True
            token_obj.save()

        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated] # User must be logged in

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        new_password = serializer.validated_data['new_password']

        user.set_password(new_password)
        user.save()

        # Log out user from all sessions after password change for security (optional)
        # update_session_auth_hash(request, user) # Requires django.contrib.auth.update_session_auth_hash
        # if using token-based authentication like JWT, this isn't strictly necessary
        # but you might want to consider revoking all existing tokens for the user.
        # With Simple JWT, this would typically involve setting 'ROTATE_REFRESH_TOKENS': True
        # and 'BLACKLIST_AFTER_ROTATION': True in settings, or a custom blacklist logic.

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )
