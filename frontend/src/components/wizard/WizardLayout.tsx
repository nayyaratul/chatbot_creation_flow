import { useState, useEffect } from 'react';
import { Steps, Button, Card, Layout, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AgentFormData } from '../../types/agent';
import Step1Identity from './Step1Identity';
import Step2Behavior from './Step2Behavior';
import Step3KnowledgeBase from './Step3KnowledgeBase';
import Step4Summary from './Step4Summary';
import PreviewPanel from './PreviewPanel';

const { Content } = Layout;
const { Step } = Steps;

interface WizardLayoutProps {
  initialData?: Partial<AgentFormData> | null;
  isEditMode?: boolean;
  onSave: (data: AgentFormData, status: 'active' | 'inactive') => void;
  onCancel: () => void;
}

const defaultFormData: AgentFormData = {
  name: '',
  description: '',
  avatarUrl: undefined,
  owners: [],
  defaultLanguage: 'English',
  settings: {
    tone: 'professional',
    firstMessage: 'Hi {user_name}, I am {agent_name}. How can I help you today?',
    temperature: 0.5,
    guardrails: {
      onlyUseKnowledgeBase: true,
      onlyCompanyJobQueries: true,
      mentionSourceDocument: true,
    },
    fallbackMessage: 'The bot must not guess or invent information. If the answer is not clearly available in the attached knowledge base or SkillBetter system context, it must explicitly state that the information is unavailable.',
    tasks: '',
    agentRole: '',
  },
  conversationConfig: {
    maxLength: 100,
    silenceTimeout: 15,
    maxDuration: undefined,
    chatMode: 'text-to-text',
  },
  knowledgeBaseFileIds: [],
};

function WizardLayout({ initialData, isEditMode, onSave, onCancel }: WizardLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AgentFormData>(() => {
    if (initialData) {
      return {
        ...defaultFormData,
        ...initialData,
        settings: {
          ...defaultFormData.settings,
          ...initialData.settings,
          guardrails: {
            ...defaultFormData.settings.guardrails,
            ...initialData.settings?.guardrails,
          },
        },
        conversationConfig: {
          ...defaultFormData.conversationConfig,
          ...initialData.conversationConfig,
        },
      };
    }
    return defaultFormData;
  });

  const steps = [
    { title: 'Identity', content: 'Identity & Purpose' },
    { title: 'Behavior', content: 'Behavior & Conversation' },
    { title: 'Knowledge', content: 'Knowledge Base' },
    { title: 'Summary', content: 'Summary & Test' },
  ];

  const updateFormData = (updates: Partial<AgentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Allow going back to previous steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1Identity
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2Behavior
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 2:
        return (
          <Step3KnowledgeBase
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <Step4Summary
            formData={formData}
            onSave={onSave}
            onPrev={handlePrev}
            onEditStep={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onCancel}
              style={{ marginBottom: '16px' }}
            >
              Back to Agents
            </Button>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              {isEditMode ? 'Edit Agent' : 'Create Agent'}
            </h1>
          </div>
          <Steps
            current={currentStep}
            onChange={handleStepClick}
            items={steps.map(s => ({ title: s.title }))}
          />
        </Card>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left: Step Content */}
          <div style={{ flex: '0 0 60%', minWidth: 0 }}>
            <Card>{renderStepContent()}</Card>
          </div>

          {/* Right: Preview Panel */}
          <div style={{ flex: '0 0 40%', position: 'sticky', top: '24px' }}>
            <PreviewPanel formData={formData} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default WizardLayout;

