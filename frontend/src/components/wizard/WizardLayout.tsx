import { useState, useRef, useEffect } from 'react';
import { Steps, Button, Card, Layout, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { AgentFormData } from '../../types/agent';
import Step1Identity, { Step1IdentityRef } from './Step1Identity';
import Step2Behavior, { Step2BehaviorRef } from './Step2Behavior';
import Step3KnowledgeBase, { Step3KnowledgeBaseRef } from './Step3KnowledgeBase';
import Step4Summary from './Step4Summary';
import PreviewPanel from './PreviewPanel';
import Sidebar from '../shared/Sidebar';

const { Content } = Layout;

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const step1FormRef = useRef<Step1IdentityRef>(null);
  const step2FormRef = useRef<Step2BehaviorRef>(null);
  const step3FormRef = useRef<Step3KnowledgeBaseRef>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  // Track sidebar collapsed state
  useEffect(() => {
    const checkSidebarState = () => {
      const sider = document.querySelector('.responsive-layout .ant-layout-sider');
      if (sider) {
        const isCollapsed = sider.classList.contains('ant-layout-sider-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    // Check initially
    checkSidebarState();

    // Watch for changes using MutationObserver
    const observer = new MutationObserver(checkSidebarState);
    const sider = document.querySelector('.responsive-layout .ant-layout-sider');
    if (sider) {
      observer.observe(sider, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer.disconnect();
  }, []);

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
    // Trigger form submission for steps 0-2 (they have forms)
    if (currentStep === 0 && step1FormRef.current) {
      step1FormRef.current.submit();
      return;
    }
    if (currentStep === 1 && step2FormRef.current) {
      step2FormRef.current.submit();
      return;
    }
    if (currentStep === 2 && step3FormRef.current) {
      step3FormRef.current.submit();
      return;
    }
    // For step 3 (Summary), just move forward if needed
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepNext = () => {
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
            ref={step1FormRef}
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleStepNext}
          />
        );
      case 1:
        return (
          <Step2Behavior
            ref={step2FormRef}
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleStepNext}
          />
        );
      case 2:
        return (
          <Step3KnowledgeBase
            ref={step3FormRef}
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleStepNext}
          />
        );
      case 3:
        return (
          <Step4Summary
            formData={formData}
            onSave={onSave}
            onEditStep={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 0) return 'Next: Behavior';
    if (currentStep === 1) return 'Next: Knowledge Base';
    if (currentStep === 2) return 'Next: Summary';
    return 'Next';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }} className="responsive-layout">
      <Sidebar />
      <Layout style={{ marginLeft: 0 }} className="responsive-main-layout">
        <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onCancel}
                size="small"
              >
                Back to Agents
              </Button>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                {isEditMode ? 'Edit Agent' : 'Create Agent'}
              </h1>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px' }}>
            {/* Left: Step Content */}
            <div style={{ flex: currentStep === 3 ? '0 0 60%' : '1 1 100%', minWidth: 0 }}>
              <Card>{renderStepContent()}</Card>
            </div>

            {/* Right: Preview Panel - Only on Summary Step */}
            {currentStep === 3 && (
              <div style={{ flex: '0 0 40%', position: 'sticky', top: '24px' }}>
                <PreviewPanel formData={formData} />
              </div>
            )}
          </div>
        </Content>

        {/* Bottom Navigation - Sticky */}
        <div
          ref={bottomNavRef}
          className="wizard-bottom-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: sidebarCollapsed ? 80 : 264,
            right: 0,
            background: '#FFFFFF',
            borderTop: '1px solid #D9D9D9',
            padding: '16px 24px',
            zIndex: 1000,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'left 0.2s',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={handlePrev} disabled={currentStep === 0} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
            
            <Steps
              current={currentStep}
              onChange={handleStepClick}
              size="small"
              items={steps.map(s => ({ title: s.title }))}
              style={{ flex: 1, maxWidth: '600px', margin: '0 24px' }}
            />
            
            {currentStep === 3 ? (
              <Space>
                <Button onClick={() => onSave(formData, 'inactive')}>
                  Save as Draft
                </Button>
                <Button type="primary" onClick={() => onSave(formData, 'active')}>
                  Create Agent
                </Button>
              </Space>
            ) : (
              <Button type="primary" onClick={handleNext} icon={<ArrowRightOutlined />}>
                {getNextButtonText()}
              </Button>
            )}
          </div>
        </div>
      </Layout>
    </Layout>
  );
}

export default WizardLayout;

