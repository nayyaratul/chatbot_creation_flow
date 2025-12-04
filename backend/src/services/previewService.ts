import { PreviewRequest, PreviewResponse, Agent } from '../types/agent';
import { composeSystemPrompt } from './promptComposer';

export function generatePreviewResponse(request: PreviewRequest): PreviewResponse {
  const { agentConfig, userMessage } = request;
  
  // Mock LLM response based on agent configuration
  const temperature = agentConfig.settings?.temperature ?? 0.5;
  const tone = agentConfig.settings?.tone ?? 'professional';
  const guardrails = agentConfig.settings?.guardrails;
  
  // Generate response based on temperature (creativity level)
  let response = '';
  
  if (temperature < 0.3) {
    // Factual - very direct and concise
    response = `Based on the available information, ${userMessage.toLowerCase().includes('policy') ? 'the policy states that' : 'the relevant information indicates that'} you should refer to the attached knowledge base documents for specific details.`;
  } else if (temperature < 0.7) {
    // Balanced - helpful but structured
    if (tone === 'soft') {
      response = `I'd be happy to help with that! Let me check the information available to me. Based on what I know, ${userMessage.toLowerCase().includes('attendance') ? 'attendance policies are outlined in the PMKVY 4.0 guidelines document.' : 'this information should be available in the knowledge base. Let me provide you with the relevant details.'}`;
    } else {
      response = `I can assist with that. According to the available documentation, ${userMessage.toLowerCase().includes('hr') ? 'HR policies are detailed in the SB_HR_Policy_v3.pdf document.' : 'the information you are seeking is covered in the attached knowledge base files.'}`;
    }
  } else {
    // Creative - more conversational
    if (tone === 'soft') {
      response = `Oh, that's a great question! I'm here to help you with that. From what I understand, ${userMessage.toLowerCase().includes('onboarding') ? 'the onboarding process is designed to be smooth and supportive. You can find detailed FAQs in the L&D_Onboarding_FAQ document.' : 'this is something we can definitely explore together using the resources I have access to.'}`;
    } else {
      response = `Thank you for your inquiry. I've reviewed the relevant documentation, and ${userMessage.toLowerCase().includes('platform') ? 'the Platform User Guide provides comprehensive navigation instructions.' : 'the answer to your question can be found in the knowledge base files attached to this agent.'}`;
    }
  }
  
  // Add guardrail mentions if enabled
  if (guardrails?.mentionSourceDocument) {
    response += ` (Source: Knowledge Base)`;
  }
  
  // If guardrails are strict, add disclaimer
  if (guardrails?.onlyUseKnowledgeBase) {
    response += ` Please note that I only provide information from the attached knowledge base.`;
  }
  
  return { response };
}

