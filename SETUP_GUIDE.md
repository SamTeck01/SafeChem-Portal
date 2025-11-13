# SafeChem Portal - Complete Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- Expo CLI
- Android Studio / Xcode (for mobile development)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/safechem
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=SafeChem Portal <noreply@safechem.com>
FRONTEND_URL=http://localhost:8081
```

### 4. Setup MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safechem?retryWrites=true&w=majority
   ```

### 5. Setup Email (for Password Reset)

**Gmail Setup:**

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use generated password in `EMAIL_PASSWORD`

### 6. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3000`

Test it: `http://localhost:3000/health`

## Frontend Setup

### 1. Navigate to Project Root

```bash
cd ..  # If you're in backend folder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For local development
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For Android emulator
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# For physical device (replace with your computer's IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

**Finding Your Computer's IP:**

Windows:
```bash
ipconfig
# Look for IPv4 Address
```

Mac/Linux:
```bash
ifconfig
# Look for inet address
```

### 4. Start Expo Development Server

```bash
npm start
```

### 5. Run on Device/Emulator

Choose one:

- Press `a` - Run on Android
- Press `i` - Run on iOS
- Scan QR code with Expo Go app (physical device)

## Testing the Authentication

### 1. Test Backend API

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "test123"
  }'
```

### 2. Test in App

1. Open app on device/emulator
2. Navigate to Sign Up screen
3. Create account
4. Try logging in
5. Test forgot password

## Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Check if MongoDB is running
- Verify MONGODB_URI in `.env`
- Check network connectivity for Atlas

**"Port 3000 already in use"**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Frontend Issues

**"Network request failed"**
- Ensure backend is running
- Check API_URL in `.env`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use computer's IP address
- Ensure device and computer are on same network

**"Unable to resolve module"**
```bash
# Clear cache
npm start -- --clear

# Or
expo start -c
```

**AsyncStorage errors**
```bash
# Reinstall app
# Clear app data in device settings
```

## Development Workflow

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Making Changes

**Backend changes:**
- Edit files in `backend/src/`
- Server auto-reloads with nodemon

**Frontend changes:**
- Edit files in `app/`, `components/`, etc.
- App auto-reloads with Fast Refresh

## Production Deployment

### Backend Deployment

**Heroku:**
```bash
cd backend
heroku create safechem-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Railway:**
1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Frontend Deployment

**Build APK:**
```bash
eas build --platform android
```

**Build for iOS:**
```bash
eas build --platform ios
```

## Environment Variables Summary

### Backend (.env)
- `PORT` - Server port (3000)
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key
- `EMAIL_*` - Email configuration
- `FRONTEND_URL` - CORS origin

### Frontend (.env)
- `EXPO_PUBLIC_API_URL` - Backend API URL

## Next Steps

1. ✅ Setup backend and frontend
2. ✅ Test authentication flow
3. 🔄 Customize UI/UX
4. 🔄 Add more features
5. 🔄 Deploy to production

## Support

For issues:
1. Check this guide
2. Review `README_AUTH.md`
3. Check backend logs
4. Check Expo console

## Security Checklist

Before production:
- [ ] Change all secret keys
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up proper email service
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Set up monitoring

Happy coding! 🚀
