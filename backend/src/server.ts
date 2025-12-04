import express from 'express';
import cors from 'cors';
import agentsRoutes from './routes/agents';
import previewRoutes from './routes/preview';
import knowledgeBaseRoutes from './routes/knowledgeBases';

const app = express();
const PORT = process.env.PORT || 3001;

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
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

