import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAllKnowledgeBases, getKnowledgeBaseById, KBFilter } from '../services/knowledgeBaseService';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// GET /api/knowledge-bases - List all knowledge bases with optional filters
router.get('/', (req: Request, res: Response) => {
  try {
    const filters: KBFilter = {
      search: req.query.search as string,
      fileType: req.query.fileType as string,
      uploadedBy: req.query.uploadedBy as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    };
    
    const files = getAllKnowledgeBases(filters);
    res.json(files);
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge bases' });
  }
});

// GET /api/knowledge-bases/:id - Get knowledge base by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const file = getKnowledgeBaseById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }
    
    res.json(file);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

export default router;

