import { useState, useEffect } from 'react';
import { Card, Collapse, Typography, Space, Button, Input, Tag, Avatar, Divider, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { AgentFormData, KnowledgeBaseFile } from '../../types/agent';
import { previewApi, knowledgeBaseApi } from '../../services/api';
import { composeSystemPrompt } from '../../utils/promptComposer';

const { Panel } = Collapse;
const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

interface Step4SummaryProps {
  formData: AgentFormData;
  onSave: (data: AgentFormData, status: 'active' | 'inactive') => void;
  onPrev: () => void;
  onEditStep: (step: number) => void;
}

function Step4Summary({ formData, onSave, onPrev, onEditStep }: Step4SummaryProps) {
  const [kbFiles, setKbFiles] = useState<KnowledgeBaseFile[]>([]);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    loadKnowledgeBases();
    generateSystemPrompt();
  }, [formData]);

  const loadKnowledgeBases = async () => {
    if (formData.knowledgeBaseFileIds.length === 0) return;
    
    try {
      const files = await Promise.all(
        formData.knowledgeBaseFileIds.map(id => knowledgeBaseApi.getById(id))
      );
      setKbFiles(files);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    }
  };

  const generateSystemPrompt = () => {
    const prompt = composeSystemPrompt({
      name: formData.name,
      description: formData.description,
      avatarUrl: formData.avatarUrl,
      settings: formData.settings,
      knowledgeBaseFileIds: formData.knowledgeBaseFileIds,
    });
    setSystemPrompt(prompt);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await previewApi.generate({
        agentConfig: {
          name: formData.name,
          description: formData.description,
          avatarUrl: formData.avatarUrl,
          settings: formData.settings,
          knowledgeBaseFileIds: formData.knowledgeBaseFileIds,
        },
        userMessage,
      });

      setMessages(prev => [...prev, { role: 'agent', content: response.response }]);
    } catch (error) {
      message.error('Failed to get response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    onSave(formData, 'inactive');
  };

  const handleCreateAgent = () => {
    onSave(formData, 'active');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 600 }}>
        Step 4 · Summary & Quick Test
      </h2>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Collapsible Summary Sections */}
        <Collapse defaultActiveKey={['identity', 'behavior', 'settings', 'knowledge']}>
          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Agent Identity</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStep(0);
                  }}
                >
                  Edit
                </Button>
              </div>
            }
            key="identity"
          >
            <Space direction="vertical" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={formData.avatarUrl} size={48}>
                  {formData.name?.charAt(0) || 'A'}
                </Avatar>
                <div>
                  <Text strong>{formData.name}</Text>
                  <br />
                  <Text type="secondary">{formData.description}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Owner(s): </Text>
                <Text>{formData.owners.length > 0 ? formData.owners.join(', ') : 'Current User'}</Text>
              </div>
              <div>
                <Text type="secondary">Default Language: </Text>
                <Text>{formData.defaultLanguage}</Text>
              </div>
            </Space>
          </Panel>

          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Behavior</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStep(1);
                  }}
                >
                  Edit
                </Button>
              </div>
            }
            key="behavior"
          >
            <Space direction="vertical" size="small">
              <div>
                <Text type="secondary">Tone: </Text>
                <Tag>{formData.settings.tone === 'soft' ? 'Soft' : 'Professional'}</Tag>
              </div>
              <div>
                <Text type="secondary">First Message: </Text>
                <Text>{formData.settings.firstMessage}</Text>
              </div>
              <div>
                <Text type="secondary">Response Style: </Text>
                <Text>
                  {formData.settings.temperature < 0.3
                    ? 'Factual'
                    : formData.settings.temperature < 0.7
                    ? 'Balanced'
                    : 'Creative'}
                </Text>
              </div>
              <div>
                <Text type="secondary">Fallback Message: </Text>
                <Text>{formData.settings.fallbackMessage}</Text>
              </div>
              <div>
                <Text type="secondary">Guardrails: </Text>
                <Space wrap>
                  {formData.settings.guardrails.onlyUseKnowledgeBase && (
                    <Tag color="blue">KB Only</Tag>
                  )}
                  {formData.settings.guardrails.onlyCompanyJobQueries && (
                    <Tag color="blue">Company/Job Only</Tag>
                  )}
                  {formData.settings.guardrails.mentionSourceDocument && (
                    <Tag color="blue">Mention Sources</Tag>
                  )}
                </Space>
              </div>
            </Space>
          </Panel>

          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Conversation Settings</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStep(1);
                  }}
                >
                  Edit
                </Button>
              </div>
            }
            key="settings"
          >
            <Space direction="vertical" size="small">
              <div>
                <Text type="secondary">Chat Mode: </Text>
                <Text>{formData.conversationConfig.chatMode}</Text>
              </div>
              <div>
                <Text type="secondary">Silence Timeout: </Text>
                <Text>
                  {formData.conversationConfig.silenceTimeout === 0
                    ? 'No auto-end'
                    : `${formData.conversationConfig.silenceTimeout} seconds`}
                </Text>
              </div>
              <div>
                <Text type="secondary">Max Conversation Duration: </Text>
                <Text>
                  {formData.conversationConfig.maxDuration || 'No limit'}
                </Text>
              </div>
              <div>
                <Text type="secondary">Max Response Length: </Text>
                <Text>{formData.conversationConfig.maxLength} words</Text>
              </div>
            </Space>
          </Panel>

          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Knowledge Base</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStep(2);
                  }}
                >
                  Edit
                </Button>
              </div>
            }
            key="knowledge"
          >
            <Space direction="vertical" size="small">
              <div>
                <Text type="secondary">Files Attached: </Text>
                <Text strong>{formData.knowledgeBaseFileIds.length}</Text>
              </div>
              {kbFiles.length > 0 && (
                <div>
                  <Text type="secondary">Files: </Text>
                  <Space wrap>
                    {kbFiles.map(file => (
                      <Tag key={file.id} title={file.description}>
                        {file.filename}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Space>
          </Panel>
        </Collapse>

        {/* System Prompt Preview */}
        <Card title="Generated System Instructions">
          <TextArea
            value={systemPrompt}
            readOnly
            rows={12}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </Card>

        {/* Quick Test Chat */}
        <Card
          title="Quick Test"
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              This test is not yet live to end users.
            </Text>
          }
        >
          <div
            style={{
              height: '300px',
              overflowY: 'auto',
              marginBottom: '16px',
              padding: '12px',
              background: '#F5F5F5',
              borderRadius: '6px',
              border: '1px solid #D9D9D9',
            }}
          >
            {messages.length === 0 ? (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Start a conversation to test the agent
              </Text>
            ) : (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: msg.role === 'user' ? '#1677FF' : '#FFFFFF',
                        color: msg.role === 'user' ? '#FFFFFF' : '#1F1F1F',
                      }}
                    >
                      <Paragraph style={{ margin: 0, fontSize: '14px' }}>
                        {msg.content}
                      </Paragraph>
                    </div>
                  </div>
                ))}
                {loading && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Agent is typing...
                  </Text>
                )}
              </Space>
            )}
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your test message..."
              rows={2}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              disabled={!inputValue.trim()}
            >
              Send
            </Button>
          </Space.Compact>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Space>
            <Button onClick={handleSaveDraft}>Save as Draft</Button>
            <Button type="primary" onClick={handleCreateAgent}>
              Create Agent
            </Button>
          </Space>
        </div>
      </Space>
    </div>
  );
}

export default Step4Summary;

