@echo off
REM Offline Start Script for Chatbot Creation Flow (Windows)
REM This script starts both backend and frontend servers for offline use

echo.
echo 🚀 Starting Chatbot Creation Flow (Offline Mode)
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "backend\node_modules" (
    echo ⚠️  Backend dependencies not found. Installing...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not found. Installing...
    cd frontend
    call npm install
    cd ..
)

echo ✅ Dependencies checked
echo.
echo Starting servers...
echo.
echo 📦 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Close the windows or press Ctrl+C in each to stop.
pause

