import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generatePreviewResponse } from '../services/previewService';
import { PreviewRequest } from '../types/agent';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/preview - Generate preview response
router.post('/', (req: Request, res: Response) => {
  try {
    const request: PreviewRequest = {
      agentConfig: req.body.agentConfig,
      userMessage: req.body.userMessage,
    };
    
    if (!request.userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }
    
    const response = generatePreviewResponse(request);
    res.json(response);
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

export default router;

