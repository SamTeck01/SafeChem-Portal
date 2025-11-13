@echo off
echo ====================================
echo SafeChem Portal - Development Setup
echo ====================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env file with your configuration
    pause
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env
    echo Please edit backend\.env file with your configuration
    pause
)

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "npm start"

echo.
echo ====================================
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: Follow Expo instructions
echo ====================================
