# Authentication System Documentation

## Overview

The SafeChem Portal now includes a complete authentication system with login, sign up, and password reset functionality. The system uses JWT tokens for authentication and AsyncStorage for secure local storage.

## Features

- ✅ User Login
- ✅ User Sign Up
- ✅ Forgot Password
- ✅ Secure Token Storage
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Auto-redirect based on auth state

## File Structure

```
app/
├── auth/
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Sign up screen
│   └── forgot-password.tsx # Password reset screen
├── (tabs)/
│   └── profile.tsx         # User profile screen
contexts/
└── AuthContext.tsx         # Authentication state management
services/
└── authApi.ts             # API service for authentication
components/
└── ProtectedRoute.tsx     # Route protection component
```

## Setup Instructions

### 1. Configure API URL

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

For local development:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Backend API Requirements

Your backend API should implement the following endpoints:

#### POST `/auth/login`
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "username": "string"
  },
  "token": "string",
  "refreshToken": "string (optional)"
}
```

#### POST `/auth/signup`
**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string"
  },
  "token": "string",
  "refreshToken": "string (optional)"
}
```

#### POST `/auth/forgot-password`
**Request:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Password reset instructions sent to email"
}
```

#### POST `/auth/logout` (Optional)
**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### POST `/auth/refresh` (Optional)
**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "string",
  "refreshToken": "string"
}
```

#### PATCH `/auth/profile` (Optional)
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "string (optional)",
  "email": "string (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string"
}
```

## Usage

### Using the Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, signUp } = useAuth();

  // Check if user is logged in
  if (isAuthenticated) {
    console.log('User:', user);
  }

  // Login
  const handleLogin = async () => {
    try {
      await login({ username: 'user', password: 'pass' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
}
```

### Using the Auth API Service

```tsx
import { authApi } from '../services/authApi';

// Login
const response = await authApi.login({ username, password });

// Sign up
const response = await authApi.signUp({ fullName, email, password });

// Forgot password
await authApi.forgotPassword({ email });

// Get current user
const user = await authApi.getCurrentUser();

// Check if authenticated
const isAuth = await authApi.isAuthenticated();

// Logout
await authApi.logout();
```

### Protected Routes

The app automatically redirects users based on their authentication state:
- Unauthenticated users accessing protected routes → redirected to login
- Authenticated users accessing auth routes → redirected to home

## Security Features

1. **Token Storage**: JWT tokens are securely stored in AsyncStorage
2. **Password Validation**: Minimum 6 characters required
3. **Email Validation**: Proper email format validation
4. **Input Sanitization**: Trimming and lowercase conversion for emails
5. **Error Handling**: Comprehensive error messages for users
6. **Loading States**: Prevents duplicate submissions

## Customization

### Changing Colors

Edit the styles in each auth screen:
- Login: `#1a3a52` (dark blue)
- Sign Up: `#3d6b8a` (medium blue)
- Button: `#2d5875` (accent blue)

### Adding Social Login

Add social login buttons in the auth screens:

```tsx
<TouchableOpacity style={styles.socialButton}>
  <Ionicons name="logo-google" size={24} color="#fff" />
  <Text>Continue with Google</Text>
</TouchableOpacity>
```

### Custom Validation

Modify validation in the auth screens:

```tsx
// In signup.tsx
if (password.length < 8) {
  Alert.alert('Error', 'Password must be at least 8 characters');
  return;
}

// Add password strength check
const hasUpperCase = /[A-Z]/.test(password);
const hasNumber = /[0-9]/.test(password);
if (!hasUpperCase || !hasNumber) {
  Alert.alert('Error', 'Password must contain uppercase and numbers');
  return;
}
```

## Testing

### Test Without Backend

For testing without a backend, you can modify `authApi.ts` to use mock data:

```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Mock response for testing
  const mockResponse: AuthResponse = {
    user: {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      username: credentials.username,
    },
    token: 'mock-jwt-token',
  };
  
  await this.storeAuthData(mockResponse);
  return mockResponse;
}
```

## Troubleshooting

### "Network request failed"
- Check if API_URL is correctly set in `.env`
- Ensure backend server is running
- Check CORS settings on backend

### "Token expired"
- Implement token refresh logic using `authApi.refreshToken()`
- Add token expiration handling in API interceptor

### AsyncStorage errors
- Clear app data and reinstall
- Check AsyncStorage permissions

## Next Steps

1. **Implement Backend**: Set up your backend API with the required endpoints
2. **Add Biometric Auth**: Integrate fingerprint/face ID for login
3. **Social Login**: Add Google, Facebook, Apple sign-in
4. **Email Verification**: Add email verification flow
5. **Two-Factor Auth**: Implement 2FA for enhanced security
6. **Profile Editing**: Complete the profile edit functionality
7. **Password Reset**: Implement the full password reset flow with token validation

## Support

For issues or questions, please refer to the main README.md or contact the development team.
