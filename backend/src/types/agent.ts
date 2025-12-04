export type AgentStatus = 'active' | 'inactive';

export type Tone = 'soft' | 'professional';

export type ChatMode = 'text-to-text';

export interface Guardrails {
  onlyUseKnowledgeBase: boolean;
  onlyCompanyJobQueries: boolean;
  mentionSourceDocument: boolean;
}

export interface AgentSettings {
  tone: Tone;
  firstMessage: string;
  temperature: number; // 0-1
  guardrails: Guardrails;
  fallbackMessage: string;
  tasks: string;
  agentRole?: string;
}

export interface ConversationConfig {
  maxLength: number; // in words
  silenceTimeout: number; // in seconds, 0 means no auto-end
  maxDuration?: string; // HH:MM format or null
  chatMode: ChatMode;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  ownerId: string;
  owners: string[]; // Additional owners
  defaultLanguage: string;
  status: AgentStatus;
  settings: AgentSettings;
  conversationConfig: ConversationConfig;
  knowledgeBaseFileIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseFile {
  id: string;
  filename: string;
  description: string;
  uploadedBy: string;
  uploadedOn: string;
  fileType: string;
  url?: string;
}

export interface PreviewRequest {
  agentConfig: Partial<Agent>;
  userMessage: string;
}

export interface PreviewResponse {
  response: string;
}

