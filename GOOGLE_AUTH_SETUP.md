# Google Authentication Setup Guide

## Overview

Your SafeChem Portal now has professional authentication with:
- ✅ **Auth Gate** - Users must login/signup before accessing the app
- ✅ **Google Sign-In** - One-click authentication with Google
- ✅ **Traditional Auth** - Email/password login still available
- ✅ **Backend Integration** - Google auth fully integrated with your backend

## 🔧 Setup Google OAuth

To enable Google Sign-In, you need to configure Google Cloud Console:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "SafeChem Portal"

### Step 2: Enable Google+ API

1. In the sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen if prompted:
   - User Type: **External**
   - App name: **SafeChem Portal**
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue

### Step 4: Create OAuth Client IDs

You need to create 3 separate OAuth client IDs:

#### A. Web Application (Required)
1. Application type: **Web application**
2. Name: "SafeChem Portal Web"
3. Authorized JavaScript origins:
   ```
   http://localhost:8082
   http://localhost:19006
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:8082
   http://localhost:19006
   ```
5. Click **Create**
6. Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

#### B. iOS (If deploying to iOS)
1. Application type: **iOS**
2. Name: "SafeChem Portal iOS"
3. Bundle ID: Your app's bundle ID (e.g., `com.safechem.portal`)
4. Click **Create**
5. Copy the **Client ID**

#### C. Android (If deploying to Android)
1. Application type: **Android**
2. Name: "SafeChem Portal Android"
3. Package name: Your app's package name (e.g., `com.safechem.portal`)
4. SHA-1 certificate fingerprint:
   ```bash
   # For development, get it from:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
5. Click **Create**
6. Copy the **Client ID**

### Step 5: Update Frontend Environment Variables

Edit your `.env` file:

```env
EXPO_PUBLIC_API_URL=https://safechem-backend.onrender.com/api

# Google OAuth Client IDs
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
```

### Step 6: Update app.json (For Expo)

Add Google scheme to your `app.json`:

```json
{
  "expo": {
    "scheme": "safechem",
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### Step 7: Deploy Backend Changes

Your backend has been updated with Google authentication. Deploy the changes:

```bash
cd "C:\Users\PC\OneDrive\Desktop\Projects\SafeChem Backend"

# Commit changes
git add .
git commit -m "Add Google authentication support"

# Push to your deployment (Render, Heroku, etc.)
git push origin main
```

Or if using Render, it will auto-deploy when you push to GitHub.

## 🧪 Testing

### Test Without Google OAuth (For Now)

If you haven't set up Google OAuth yet, you can still test traditional login:

1. **Sign Up** with email/password
2. **Login** with your credentials
3. Access the app

### Test With Google OAuth (After Setup)

1. Click "Continue with Google" button
2. Select your Google account
3. Grant permissions
4. You'll be logged in automatically

## 🎯 How It Works

### Authentication Flow

1. **App Start** → Check if user is authenticated
2. **Not Authenticated** → Redirect to Login screen
3. **User Options:**
   - Enter email/password → Traditional login
   - Click Google button → Google OAuth flow
4. **After Auth** → Redirect to main app

### Google Auth Flow

```
User clicks "Continue with Google"
    ↓
Opens Google sign-in popup
    ↓
User selects account & grants permission
    ↓
Google returns user info (id, email, name, picture)
    ↓
Frontend sends to backend: POST /api/auth/google
    ↓
Backend checks if user exists:
    - Exists → Login user
    - New → Create account
    ↓
Backend returns JWT token
    ↓
User is logged in
```

## 📱 User Experience

### First Time Users
- See login screen immediately
- Can sign up with email or Google
- No access to app without authentication

### Returning Users
- If token is valid → Direct access to app
- If token expired → Redirect to login
- Can logout from profile screen

## 🔐 Security Features

- ✅ JWT tokens with 7-day expiry
- ✅ Refresh tokens for extended sessions
- ✅ Google emails are pre-verified
- ✅ Secure password storage (for email/password users)
- ✅ Protected routes
- ✅ Auth state persistence

## 🚀 What's Changed

### Frontend Changes
- ✅ `app/index.tsx` - Auth gate (forces login)
- ✅ `app/auth/login.tsx` - Added Google Sign-In button
- ✅ `app/auth/signup.tsx` - Added Google Sign-In button
- ✅ `services/googleAuth.ts` - Google OAuth service
- ✅ `services/authApi.ts` - Added `googleLogin()` method
- ✅ Removed back buttons from auth screens

### Backend Changes
- ✅ `src/models/User.model.js` - Added `googleId` and `picture` fields
- ✅ `src/controllers/googleAuth.controller.js` - Google auth logic
- ✅ `src/routes/auth.routes.js` - Added `POST /api/auth/google` endpoint

## 📝 API Endpoint

### POST `/api/auth/google`

**Request:**
```json
{
  "googleId": "1234567890",
  "email": "user@gmail.com",
  "fullName": "John Doe",
  "picture": "https://lh3.googleusercontent.com/..."
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user@gmail.com",
    "fullName": "John Doe",
    "picture": "...",
    "isEmailVerified": true
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

## 🐛 Troubleshooting

### "Google Sign-In Failed"
- Check if Google Client IDs are set in `.env`
- Verify redirect URIs in Google Console
- Check browser console for errors

### "Invalid Client ID"
- Ensure you're using the correct Client ID for your platform
- Web ID for web/Expo Go
- iOS ID for iOS builds
- Android ID for Android builds

### "Unauthorized"
- Check if backend is deployed with latest changes
- Verify API URL in `.env`
- Check backend logs

## 🎨 Customization

### Change Button Style

Edit `app/auth/login.tsx` or `signup.tsx`:

```tsx
googleButton: {
  backgroundColor: '#4285F4', // Google blue
  // or
  backgroundColor: '#fff', // White (current)
}
```

### Add More OAuth Providers

You can add Facebook, Apple, etc. using similar patterns:
1. Install provider SDK
2. Create service file (like `googleAuth.ts`)
3. Add button to auth screens
4. Create backend endpoint
5. Update User model

## ✅ Next Steps

1. **Set up Google OAuth** (follow steps above)
2. **Test authentication** on your device
3. **Deploy backend** with Google auth support
4. **Test Google Sign-In** end-to-end
5. **Add profile pictures** (Google provides them)
6. **Customize UI** to match your brand

## 🎉 You're Done!

Your app now has professional authentication! Users must login before accessing any features, and they can use Google for quick sign-in.

---

**Need Help?** Check the main README.md or backend documentation.
