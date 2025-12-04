# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

> **💡 Offline Mode**: This application works completely offline after initial setup! See [OFFLINE.md](./OFFLINE.md) for details.

## Setup (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:3001`

### 2. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`

### 3. Open in Browser
Navigate to `http://localhost:3000/agents`

## First Steps

1. **View Agents List**: You'll see an empty state with "Create your first Agent" card
2. **Create Agent**: Click "Create Agent" button
3. **Complete Wizard**:
   - Step 1: Enter agent name, description, upload avatar
   - Step 2: Configure tone, guardrails, conversation settings
   - Step 3: Select knowledge base files (at least 1 required)
   - Step 4: Review summary, test chat, then create
4. **Preview**: Click the eye icon on any agent to preview and test

## Key Features to Try

- **Live Preview**: Notice the preview panel updates as you type in the wizard
- **Test Chat**: Use the preview drawer or Step 4 test chat to interact with agents
- **System Prompt**: View the auto-generated system prompt in Step 4
- **Edit Flow**: Click "Edit" on any agent to modify its configuration

## Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/src/server.ts` or set `PORT=3002 npm run dev`
- Frontend: Change port in `frontend/vite.config.ts`

### Module Not Found Errors
- Make sure you've run `npm install` in both `backend/` and `frontend/` directories
- Delete `node_modules` and `package-lock.json`, then reinstall

### API Connection Issues
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify proxy settings in `frontend/vite.config.ts`

## Offline Usage

This application is **fully offline-capable**! After installing dependencies once (requires internet), you can run it completely offline:

- ✅ No external API calls
- ✅ No CDN dependencies  
- ✅ All data stored locally
- ✅ Works without internet connection

**Quick start offline:**
- Use `./start-offline.sh` (Mac/Linux) or `start-offline.bat` (Windows)
- Or manually: `npm run dev` in both `backend/` and `frontend/` directories

See [OFFLINE.md](./OFFLINE.md) for complete offline usage guide.

## Next Steps

- Customize the design system colors in `frontend/src/index.tsx`
- Add real LLM integration in `backend/src/services/previewService.ts`
- Connect to a real database instead of JSON files
- Add file upload functionality for avatars and knowledge bases

