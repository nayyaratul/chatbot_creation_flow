import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentStatus } from '../types/agent';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage';

const AGENTS_FILE = 'agents.json';

export function getAllAgents(): Agent[] {
  const agents = readJsonFile<Agent>(AGENTS_FILE);
  // Sort by updatedAt DESC
  return agents.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getAgentById(id: string): Agent | null {
  const agents = readJsonFile<Agent>(AGENTS_FILE);
  return agents.find(agent => agent.id === id) || null;
}

export function createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
  const agents = readJsonFile<Agent>(AGENTS_FILE);
  
  const newAgent: Agent = {
    ...agentData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  agents.push(newAgent);
  writeJsonFile(AGENTS_FILE, agents);
  
  return newAgent;
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const agents = readJsonFile<Agent>(AGENTS_FILE);
  const index = agents.findIndex(agent => agent.id === id);

  if (index === -1) {
    return null;
  }

  const updatedAgent: Agent = {
    ...agents[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };

  agents[index] = updatedAgent;
  writeJsonFile(AGENTS_FILE, agents);

  return updatedAgent;
}

export function deleteAgent(id: string): boolean {
  const agents = readJsonFile<Agent>(AGENTS_FILE);
  const index = agents.findIndex(agent => agent.id === id);

  if (index === -1) {
    return false;
  }

  agents.splice(index, 1);
  writeJsonFile(AGENTS_FILE, agents);

  return true;
}

