# SafeChem Portal 🧪

A comprehensive chemical information portal built with React Native (Expo) and Node.js, featuring user authentication, chemical search, and AI-powered assistance.

## ✨ Features

- 🔐 **Complete Authentication System**
  - User registration and login
  - Password reset via email
  - JWT token authentication
  - Secure profile management
  
- 🔍 **Chemical Search**
  - PubChem API integration
  - Advanced search capabilities
  - Chemical information display
  - SDS generation

- 🤖 **AI Chat Assistant**
  - Chemical information queries
  - Safety data assistance

- 📱 **Modern UI/UX**
  - Beautiful gradient designs
  - Smooth animations
  - Responsive layouts
  - Tab-based navigation

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Expo CLI
- Android Studio / Xcode (optional)

### Option 1: Automated Setup (Windows)

```bash
# Run the setup script
start-dev.bat
```

### Option 2: Manual Setup

**1. Install Frontend Dependencies**
```bash
npm install
```

**2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

**3. Configure Frontend**
```bash
cp .env.example .env
# Edit .env with backend URL
```

**4. Start Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm start
```

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[README_AUTH.md](README_AUTH.md)** - Authentication system documentation
- **[BACKEND_SUMMARY.md](BACKEND_SUMMARY.md)** - Backend implementation details
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🏗️ Project Structure

```
SafeChem Portal/
├── app/                    # React Native screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   ├── ai-chat.tsx    # AI chat screen
│   │   └── profile.tsx    # Profile screen
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   └── chemical/          # Chemical detail screens
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Helper functions
│   └── package.json
├── components/            # Reusable components
├── contexts/             # React contexts
├── services/             # API services
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- Expo Router (file-based routing)
- AsyncStorage (secure storage)
- NativeWind (Tailwind CSS)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (email)
- bcryptjs (password hashing)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Error handling

## 📱 Running the App

### Development Build
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"test123"}'
```

## 🌐 Environment Variables

### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend (backend/.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/safechem
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🚢 Deployment

### Backend
- Heroku
- Railway
- DigitalOcean
- AWS

### Frontend
- EAS Build (Expo)
- App Store
- Google Play Store

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📧 Support

For issues or questions, check the documentation or create an issue.

---

Built with ❤️ using React Native and Node.js
