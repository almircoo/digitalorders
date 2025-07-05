from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    UserRegisterView,
    UserLoginView,
    UserProfileView,
    EmailVerificationRequestView,
    EmailVerificationConfirmView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ChangePasswordView,
)

urlpatterns = [
    # Authentication
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'), # For authenticated user's profile

    # Email Verification
    path('verify-email/request/', EmailVerificationRequestView.as_view(), name='verify-email-request'),
    path('verify-email/confirm/', EmailVerificationConfirmView.as_view(), name='verify-email-confirm'),

    # Password Reset
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Change Password (Authenticated)
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # JWT Token management
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
