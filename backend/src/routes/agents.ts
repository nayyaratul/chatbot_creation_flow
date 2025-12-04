import { Router, Request, Response } from 'express';
import { authMiddleware, canEditAgent } from '../middleware/auth';
import { getAllAgents, getAgentById, createAgent, updateAgent, deleteAgent } from '../services/agentService';
import { Agent, AgentStatus } from '../types/agent';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/agents - List all agents
router.get('/', (req: Request, res: Response) => {
  try {
    const agents = getAllAgents();
    
    // Filter based on user role
    const user = req.user!;
    let filteredAgents = agents;
    
    if (user.role === 'viewer' || user.role === 'editor') {
      // Editors and viewers can only see agents they own or are shared with
      filteredAgents = agents.filter(agent => 
        agent.ownerId === user.id || agent.owners.includes(user.id)
      );
    }
    
    res.json(filteredAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// GET /api/agents/:id - Get agent by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const agent = getAgentById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Check access
    const user = req.user!;
    if (user.role === 'viewer' || user.role === 'editor') {
      if (agent.ownerId !== user.id && !agent.owners.includes(user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// POST /api/agents - Create new agent
router.post('/', (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    // Check if user can create agents
    if (user.role === 'viewer') {
      return res.status(403).json({ error: 'Viewers cannot create agents' });
    }
    
    const agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> = {
      name: req.body.name,
      description: req.body.description,
      avatarUrl: req.body.avatarUrl,
      ownerId: user.id,
      owners: req.body.owners || [],
      defaultLanguage: req.body.defaultLanguage || 'English',
      status: (req.body.status as AgentStatus) || 'inactive',
      settings: req.body.settings,
      conversationConfig: req.body.conversationConfig,
      knowledgeBaseFileIds: req.body.knowledgeBaseFileIds || [],
    };
    
    // Validate required fields
    if (!agentData.name || !agentData.settings || !agentData.conversationConfig) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newAgent = createAgent(agentData);
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', (req: Request, res: Response) => {
  try {
    const agent = getAgentById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const user = req.user!;
    
    // Check if user can edit this agent
    if (!canEditAgent(agent, user)) {
      return res.status(403).json({ error: 'You do not have permission to edit this agent' });
    }
    
    const updates: Partial<Agent> = {
      ...req.body,
      id: agent.id, // Ensure ID doesn't change
    };
    
    const updatedAgent = updateAgent(req.params.id, updates);
    
    if (!updatedAgent) {
      return res.status(500).json({ error: 'Failed to update agent' });
    }
    
    res.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const agent = getAgentById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const user = req.user!;
    
    // Only super admins and admins can delete
    if (user.role !== 'super_admin' && user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to delete agents' });
    }
    
    const deleted = deleteAgent(req.params.id);
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete agent' });
    }
    
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

export default router;

