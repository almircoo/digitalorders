from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from cloudinary.models import CloudinaryField
import uuid
import secrets
from datetime import timedelta
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError('User must have an email address')
        if role is None:
            role = 1 

        user = self.model(
            email = self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            role=role,
            **extra_fields, #agrega otros campos si existen
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, email, password=None):
        user = self.create_user(
            email = self.normalize_email(email),
            password = password,
            first_name = first_name,
            last_name = last_name,
            role= self.model.SUPERUSER,
        )
        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superadmin = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    RESTAURANT = 1
    PROVIDER = 2
    SUPERUSER = 2193
    ROLE_CHOICES = (
        (RESTAURANT, 'Restaurant'),
        (PROVIDER, 'Provider'),
        (SUPERUSER, 'Admin')
    )
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.IntegerField(choices=ROLE_CHOICES, blank=False, null=False, default=RESTAURANT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
    
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_perms(self, app_label):
        return True

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    phone = models.CharField(max_length=20, blank=True, verbose_name="Personal Phone")
    address = models.TextField(max_length=100, blank=True, verbose_name="Personal Address")
    city = models.CharField(max_length=100, blank=True, verbose_name="Personal City")
    country = models.CharField(max_length=100, blank=True, verbose_name="Personal Country")
    zip_code = models.CharField(max_length=20, blank=True, verbose_name="Personal Zip Code")

    is_email_verified = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    
    # for Tracking ip
    latitude = models.CharField(max_length=20, blank=True, null=True)
    longitude = models.CharField(max_length=20, blank=True, null=True)
    last_known_ip = models.GenericIPAddressField(blank=True, null=True, verbose_name="Last Known IP")
    location_updated_at = models.DateTimeField(blank=True, null=True, verbose_name="Location Updated At")
    # metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    

class ProviderProfile(models.Model):
    SOLE_PROPRIETOR = 1
    PARTNERSHIP = 2
    CORPORATION = 3
    COOPERATIVE = 4
    LLC = 5
    
    BUSINESS_TYPE_CHOICES = [
        (SOLE_PROPRIETOR, 'Persona Natural con Negocio'),
        (PARTNERSHIP, 'Sociedad'),
        (CORPORATION, 'Corporacion'),
        (COOPERATIVE, 'Cooperativa'),
        (LLC, 'Sociedad de Responsabilidad Limitada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider')
    
    # General Information
    company_name = models.CharField(max_length=200, verbose_name="Nombre de la Empresa")
    description = models.TextField(blank=True, verbose_name="Descripcion")
    email = models.EmailField(verbose_name="Email Corporativo")
    phone = models.CharField(max_length=20, verbose_name="Telefono")
    profile_image = CloudinaryField('provider_logo', blank=True, null=True)
    
    # Address Information
    address = models.CharField(max_length=250, verbose_name="Direccion")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    state = models.CharField(max_length=100, verbose_name="Estado/Provincia")
    zip_code = models.CharField(max_length=20, verbose_name="Postal Code")
    country = models.CharField(max_length=100, default="Peru", verbose_name="Pais")
    
    # Business Details
    business_type = models.CharField(max_length=20, choices=BUSINESS_TYPE_CHOICES, default=CORPORATION)
    tax_id = models.CharField(max_length=20, verbose_name="RUC")
    founded_year = models.CharField(max_length=4, verbose_name="Fundation Year")
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    order_updates = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.company_name

class RestaurantProfile(models.Model):
    RESTAURANTE = 1
    CAFE = 2
    BAR = 3
    FAST_FOOD = 4
    FOOD_TRUCK = 5
    
    BUSINESS_TYPE_CHOICES = [
        (RESTAURANTE, 'Restaurant'),
        (CAFE, 'Caffe'),
        (BAR, 'Bar'),
        (FAST_FOOD, 'Fast Food'),
        (FOOD_TRUCK, 'Food Truck'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='restaurant')
    
    # General Information
    restaurant_name = models.CharField(max_length=200, verbose_name="Nombre del Restaurante")
    description = models.TextField(blank=True, verbose_name="Descripcion")
    email = models.EmailField(verbose_name="Email Corporativo")
    phone = models.CharField(max_length=20, verbose_name="Telefono")
    website = models.URLField(blank=True, verbose_name="Sitio Web")
    profile_image = CloudinaryField('restaurant_logo', blank=True, null=True)
    
    # Address Information
    address = models.CharField(max_length=250, verbose_name="Direccion")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    state = models.CharField(max_length=100, verbose_name="Estado/Provincia")
    zip_code = models.CharField(max_length=20, verbose_name="Codigo Postal")
    country = models.CharField(max_length=100, default="Peru", verbose_name="Pais")
    
    # Business Details
    business_type = models.CharField(max_length=20, choices=BUSINESS_TYPE_CHOICES, default=RESTAURANTE)
    tax_id = models.CharField(max_length=20, verbose_name="RUC")
    founded_year = models.CharField(max_length=4, verbose_name="Fundation Year")
    capacity = models.CharField(max_length=10, verbose_name="Capacidad (personas)")
    opening_hours = models.CharField(max_length=50, verbose_name="Horario de Atencion")
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    order_updates = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)

    # Meta data
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.restaurant_name
    
class EmailVerificationToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()

class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=2)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()