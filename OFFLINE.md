# Offline Usage Guide

This application is designed to work **completely offline** on localhost. Once dependencies are installed, no internet connection is required.

## ✅ Offline Capabilities

- ✅ **No external API calls** - All functionality works locally
- ✅ **No CDN dependencies** - All assets are bundled locally
- ✅ **Local file storage** - Data stored in JSON files
- ✅ **Mock LLM responses** - Preview uses simulated responses
- ✅ **Self-contained** - All npm packages work offline after installation

## 🚀 Running Offline

### Prerequisites (One-time setup - requires internet)

1. Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Install dependencies (requires internet only once):
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Development Mode (Offline)

Once dependencies are installed, you can run completely offline:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

Open `http://localhost:3000` in your browser - **no internet required!**

### Production Build (Fully Offline)

For a production build that serves everything from one server:

**1. Build frontend:**
```bash
cd frontend
npm run build:offline
```

**2. Build backend:**
```bash
cd backend
npm run build:prod
```

**3. Start production server:**
```bash
cd backend
npm run start:prod
```

The application will be available at `http://localhost:3001` with both frontend and backend served from the same server.

## 📦 What Works Offline

- ✅ Creating and managing agents
- ✅ Knowledge base selection
- ✅ Agent preview and testing
- ✅ System prompt generation
- ✅ All UI interactions
- ✅ Data persistence (JSON files)

## 🔍 Verifying Offline Mode

1. **Disconnect from internet** (or disable WiFi)
2. Start both servers as described above
3. Open `http://localhost:3000` in your browser
4. All features should work normally

## 🛠️ Troubleshooting Offline Issues

### Issue: "Cannot find module"
**Solution:** Make sure you've run `npm install` in both `backend/` and `frontend/` directories while connected to the internet.

### Issue: Port already in use
**Solution:** 
- Backend: Set `PORT=3002 npm run dev`
- Frontend: Update port in `frontend/vite.config.ts`

### Issue: API calls failing
**Solution:** 
- Ensure backend is running on port 3001
- Check that frontend proxy is configured correctly in `vite.config.ts`
- Verify CORS is enabled in backend (it is by default)

### Issue: Browser trying to fetch external resources
**Solution:** 
- Check browser console for any CDN links
- Ensure all dependencies are installed locally
- Clear browser cache and reload

## 📝 Notes

- **First-time setup requires internet** to download npm packages
- **After installation, everything works offline**
- **No external services** are called (no OpenAI, no cloud storage, etc.)
- **Data persists** in `backend/src/data/*.json` files
- **Mock responses** are used for preview functionality

## 🔄 Updating Dependencies Offline

If you need to update dependencies while offline:
1. Download package tarballs while online
2. Use `npm install --offline` with cached packages
3. Or use `npm ci` with existing `package-lock.json`

## 📚 Related Files

- `backend/src/server.ts` - Backend server configuration
- `frontend/vite.config.ts` - Frontend build configuration
- `backend/src/utils/fileStorage.ts` - Local file storage
- `backend/src/services/previewService.ts` - Mock LLM responses

