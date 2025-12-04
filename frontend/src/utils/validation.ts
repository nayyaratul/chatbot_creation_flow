import { AgentFormData } from '../types/agent';

export function validateStep1(formData: AgentFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.name || formData.name.trim().length === 0) {
    errors.push('Agent name is required');
  } else if (formData.name.length > 20) {
    errors.push('Agent name must be 20 characters or less');
  }

  if (formData.description && formData.description.length > 60) {
    errors.push('Description must be 60 characters or less');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStep2(formData: AgentFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.settings.firstMessage || formData.settings.firstMessage.trim().length === 0) {
    errors.push('First message is required');
  } else if (formData.settings.firstMessage.length > 150) {
    errors.push('First message must be 150 characters or less');
  }

  if (formData.settings.tasks && formData.settings.tasks.length > 1500) {
    errors.push('Tasks must be 1500 characters or less');
  }

  if (formData.conversationConfig.maxLength < 50) {
    errors.push('Max response length must be at least 50 words');
  }

  if (formData.conversationConfig.silenceTimeout < 5 && formData.conversationConfig.silenceTimeout !== 0) {
    errors.push('Silence timeout must be at least 5 seconds or 0 (no auto-end)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStep3(formData: AgentFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (formData.knowledgeBaseFileIds.length === 0) {
    errors.push('At least one knowledge base file must be selected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAllSteps(formData: AgentFormData): { valid: boolean; errors: string[] } {
  const step1 = validateStep1(formData);
  const step2 = validateStep2(formData);
  const step3 = validateStep3(formData);

  return {
    valid: step1.valid && step2.valid && step3.valid,
    errors: [...step1.errors, ...step2.errors, ...step3.errors],
  };
}

