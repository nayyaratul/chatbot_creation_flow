import { Agent, AgentSettings, Guardrails } from '../types/agent';

export function composeSystemPrompt(agent: Partial<Agent>): string {
  const name = agent.name || 'Agent';
  const description = agent.description || '';
  const role = agent.settings?.agentRole || 'Assistant';
  const tasks = agent.settings?.tasks || '';
  const tone = agent.settings?.tone || 'professional';
  const guardrails = agent.settings?.guardrails;
  const fallbackMessage = agent.settings?.fallbackMessage || '';

  let prompt = `You are ${name}, ${description}\n\n`;
  prompt += `Your role: ${role}\n\n`;

  if (tasks) {
    prompt += `Your tasks and responsibilities:\n${tasks}\n\n`;
  }

  prompt += `Tone of voice: ${tone === 'soft' ? 'Warm, friendly, and approachable' : 'Professional, clear, and concise'}\n\n`;

  // Guardrails
  prompt += `Guardrails and safety rules:\n`;
  
  if (guardrails) {
    if (guardrails.onlyUseKnowledgeBase) {
      prompt += `- Only reply using information from the attached knowledge base and company policy documents. Do not use external knowledge or make assumptions.\n`;
    }
    
    if (guardrails.onlyCompanyJobQueries) {
      prompt += `- Only answer queries related to the company, job responsibilities, or work-related topics. Politely decline off-topic questions.\n`;
    }
    
    if (guardrails.mentionSourceDocument) {
      prompt += `- When providing information, mention which document or knowledge base entry the answer came from (when applicable).\n`;
    }
  }

  // Always-on defaults
  prompt += `- Maintain a polite, professional tone at all times.\n`;
  prompt += `- Avoid providing legal, medical, or financial advice. Direct users to appropriate professionals.\n`;
  prompt += `- If you are unsure about an answer, explicitly state that you don't know rather than guessing.\n`;
  prompt += `- If a query is out of scope, guide the user to the next appropriate step or resource.\n\n`;

  if (fallbackMessage) {
    prompt += `Fallback behavior:\n${fallbackMessage}\n\n`;
  }

  prompt += `First message to users: ${agent.settings?.firstMessage || `Hi, I am ${name}. How can I help you today?`}\n\n`;

  if (agent.knowledgeBaseFileIds && agent.knowledgeBaseFileIds.length > 0) {
    prompt += `You have access to ${agent.knowledgeBaseFileIds.length} knowledge base file(s). Use this information to answer questions accurately.\n`;
  }

  return prompt;
}

