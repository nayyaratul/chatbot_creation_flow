import axios from 'axios';
import { Agent, KnowledgeBaseFile, PreviewRequest, PreviewResponse } from '../types/agent';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const agentApi = {
  getAll: async (): Promise<Agent[]> => {
    const response = await api.get<Agent[]>('/agents');
    return response.data;
  },

  getById: async (id: string): Promise<Agent> => {
    const response = await api.get<Agent>(`/agents/${id}`);
    return response.data;
  },

  create: async (agent: Partial<Agent>): Promise<Agent> => {
    const response = await api.post<Agent>('/agents', agent);
    return response.data;
  },

  update: async (id: string, agent: Partial<Agent>): Promise<Agent> => {
    const response = await api.put<Agent>(`/agents/${id}`, agent);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/agents/${id}`);
  },
};

export const knowledgeBaseApi = {
  getAll: async (filters?: {
    search?: string;
    fileType?: string;
    uploadedBy?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<KnowledgeBaseFile[]> => {
    const response = await api.get<KnowledgeBaseFile[]>('/knowledge-bases', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<KnowledgeBaseFile> => {
    const response = await api.get<KnowledgeBaseFile>(`/knowledge-bases/${id}`);
    return response.data;
  },
};

export const previewApi = {
  generate: async (request: PreviewRequest): Promise<PreviewResponse> => {
    const response = await api.post<PreviewResponse>('/preview', request);
    return response.data;
  },
};

