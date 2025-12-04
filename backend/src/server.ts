import express from 'express';
import cors from 'cors';
import path from 'path';
import agentsRoutes from './routes/agents';
import previewRoutes from './routes/preview';
import knowledgeBaseRoutes from './routes/knowledgeBases';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agents', agentsRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/knowledge-bases', knowledgeBaseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', offline: true });
});

// Serve static files in production (for offline use)
if (NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendBuildPath));
  
  // Serve frontend for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve frontend for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${NODE_ENV}`);
  if (NODE_ENV === 'production') {
    console.log('Serving frontend from backend (offline mode enabled)');
  }
});

