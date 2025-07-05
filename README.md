# Digital Orders Platform

A comprehensive platform for managing digital orders between restaurants and providers.

## Features

### Authentication & Profile Management

The platform includes a robust authentication system with automatic profile loading:

#### Profile Loading Logic

After successful login, the system automatically:

1. **Loads User Profile Data**: Fetches complete profile information from the backend
2. **Handles Role-Based Profiles**: 
   - **Providers**: Loads `ProviderProfile` data (company info, business details, preferences)
   - **Restaurants**: Loads `RestaurantProfile` data (restaurant info, capacity, opening hours)
   - **User Profile**: Loads common user data (phone, address, etc.)

3. **Session Persistence**: Profile data is cached in session storage and reloaded on app restart
4. **Real-time Updates**: Profile changes are immediately reflected in the UI

#### API Endpoints

- `GET /api/auth/profile/` - Fetch user profile data
- `PUT /api/auth/profile/` - Update user profile data
- `POST /api/auth/login/` - User authentication

#### Frontend Components

- **Provider Account Settings** (`frontend/src/components/provider/Account.jsx`)
- **Restaurant Account Settings** (`frontend/src/components/restaurant/Account.jsx`)
- **Auth Context** (`frontend/src/contexts/AuthContext.jsx`) - Manages authentication state and profile loading

#### Profile Data Structure

```javascript
// Provider Profile
{
  provider: {
    company_name: string,
    description: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zip_code: string,
    country: string,
    business_type: string,
    tax_id: string,
    founded_year: string,
    email_notifications: boolean,
    sms_notifications: boolean,
    order_updates: boolean,
    marketing_emails: boolean,
    profile_image: string
  },
  user_profile: {
    phone: string,
    address: string,
    city: string,
    country: string,
    zip_code: string
  }
}

// Restaurant Profile
{
  restaurant: {
    restaurant_name: string,
    description: string,
    email: string,
    phone: string,
    website: string,
    address: string,
    city: string,
    state: string,
    zip_code: string,
    country: string,
    business_type: string,
    tax_id: string,
    founded_year: string,
    capacity: string,
    opening_hours: string,
    email_notifications: boolean,
    sms_notifications: boolean,
    order_updates: boolean,
    marketing_emails: boolean,
    profile_image: string
  },
  user_profile: {
    phone: string,
    address: string,
    city: string,
    country: string,
    zip_code: string
  }
}
```

## Backend Structure

### Django Models

- `User` - Base user model with role-based authentication
- `UserProfile` - Common user profile data
- `ProviderProfile` - Provider-specific business data
- `RestaurantProfile` - Restaurant-specific business data

### Authentication Flow

1. User logs in with email, password, and role
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens and automatically loads profile data
4. Profile data is cached and used throughout the application
5. Profile updates are sent to backend and immediately reflected in UI

## Getting Started

### Backend Setup

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RESEND_API_KEY=your_resend_key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5173
```

# DigitalOrder
Digital system for connect restaurants with providers
## instalar manejador de paquetes
https://pnpm.io/installation
Step 1: commando para instalar (windows o macos)
```shell
npm install -g pnpm
```
step 2: clonar el repositorio o descargar
```
Localizar el path donde se clono o descargo
```

step 3: Instalar dependencias con pnpm
``` shell
pnpm i
```

step 4: Iniciar local host
``` shell
pnpm run dev
```

Credenciales para acceder a la pagina

Restaurant
```
Email: restaurant@email.com
Password: RestUser123
```
Provider
```
Email: provider@email.com
Password: ProviUser123
```
# Backend
Python, DRF, JWT, PostgreSQL, Redis, Celery, 
Resend, AWS, Cloudinary, DigitalOcean