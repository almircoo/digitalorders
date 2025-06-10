from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms
from .models import User, UserProfile, ProviderProfile, RestaurantProfile


class UserCreationForm(forms.ModelForm):
    """Formulario para crear nuevos usuarios"""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'role')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """Formulario para actualizar usuarios"""
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role', 
                 'is_active', 'is_admin', 'is_staff', 'is_superadmin')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'first_name', 'last_name', 'role_display', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_superadmin', 'is_active', 'date_joined')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_admin', 'is_superadmin', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )
    
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)
    readonly_fields = ('date_joined', 'last_login')

    def role_display(self, obj):
        return obj.get_role_display()
    role_display.short_description = 'Role'


class UserProfileInline(admin.TabularInline):
    """Inline para UserProfile"""
    model = UserProfile
    extra = 0
    fields = ('phone', 'city', 'country', 'address')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'phone', 'city', 'country', 'created_at')
    list_filter = ('country', 'city', 'created_at')
    search_fields = ('phone', 'city', 'country')
    readonly_fields = ('created_at', 'updated_at', 'location_updated_at')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('phone', 'address', 'city', 'country', 'zip_code')
        }),
        ('Location Tracking', {
            'fields': ('latitude', 'longitude', 'last_known_ip', 'location_updated_at'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_user_email(self, obj):
        return obj.user.email if hasattr(obj, 'user') else 'No User'
    get_user_email.short_description = 'User Email'


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'get_user_email', 'business_type_display', 'city', 'country', 'created_at')
    list_filter = ('business_type', 'country', 'city', 'email_notifications', 'created_at')
    search_fields = ('company_name', 'user__email', 'tax_id', 'city')
    readonly_fields = ('id', 'created_at', 'modified_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Company Information', {
            'fields': ('company_name', 'description', 'email', 'phone', 'profile_image')
        }),
        ('Address Information', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Business Details', {
            'fields': ('business_type', 'tax_id', 'founded_year')
        }),
        ('Notification Preferences', {
            'fields': ('email_notifications', 'sms_notifications', 'order_updates', 'marketing_emails'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'modified_at'),
            'classes': ('collapse',)
        }),
    )

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'
    
    def business_type_display(self, obj):
        return obj.get_business_type_display()
    business_type_display.short_description = 'Business Type'


@admin.register(RestaurantProfile)
class RestaurantProfileAdmin(admin.ModelAdmin):
    list_display = ('restaurant_name', 'get_user_email', 'business_type_display', 'city', 'country', 'capacity', 'created_at')
    list_filter = ('business_type', 'country', 'city', 'email_notifications', 'created_at')
    search_fields = ('restaurant_name', 'user__email', 'tax_id', 'city')
    readonly_fields = ('id', 'created_at', 'modified_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Restaurant Information', {
            'fields': ('restaurant_name', 'description', 'email', 'phone', 'website', 'profile_image')
        }),
        ('Address Information', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Business Details', {
            'fields': ('business_type', 'tax_id', 'founded_year', 'capacity', 'opening_hours')
        }),
        ('Notification Preferences', {
            'fields': ('email_notifications', 'sms_notifications', 'order_updates', 'marketing_emails'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'modified_at'),
            'classes': ('collapse',)
        }),
    )

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'
    
    def business_type_display(self, obj):
        return obj.get_business_type_display()
    business_type_display.short_description = 'Business Type'


# Personalizar el título del admin
admin.site.site_header = "Food Platform Administration"
admin.site.site_title = "Food Platform Admin"
admin.site.index_title = "Welcome to Food Platform Administration"