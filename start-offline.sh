#!/bin/bash

# Offline Start Script for Chatbot Creation Flow
# This script starts both backend and frontend servers for offline use

echo "🚀 Starting Chatbot Creation Flow (Offline Mode)"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not found. Installing..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not found. Installing..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencies checked"
echo ""
echo "Starting servers..."
echo ""
echo "📦 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for both processes
wait

