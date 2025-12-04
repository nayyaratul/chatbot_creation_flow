import { useState, useEffect } from 'react';
import { Drawer, Avatar, Tag, Space, Input, Button, Card, Divider, Typography, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Agent } from '../../types/agent';
import { previewApi, knowledgeBaseApi } from '../../services/api';
import { KnowledgeBaseFile } from '../../types/agent';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface PreviewDrawerProps {
  agent: Agent | null;
  visible: boolean;
  onClose: () => void;
}

function PreviewDrawer({ agent, visible, onClose }: PreviewDrawerProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [kbFiles, setKbFiles] = useState<KnowledgeBaseFile[]>([]);

  useEffect(() => {
    if (agent && visible) {
      loadKnowledgeBases();
      // Reset messages when drawer opens
      setMessages([]);
      setInputValue('');
    }
  }, [agent, visible]);

  const loadKnowledgeBases = async () => {
    if (!agent || agent.knowledgeBaseFileIds.length === 0) return;
    
    try {
      const files = await Promise.all(
        agent.knowledgeBaseFileIds.map(id => knowledgeBaseApi.getById(id))
      );
      setKbFiles(files);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !agent) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await previewApi.generate({
        agentConfig: agent,
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

  if (!agent) return null;

  return (
    <Drawer
      title="Agent Preview"
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
      className="responsive-drawer"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Agent Identity */}
        <Card>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                src={agent.avatarUrl}
                size={64}
                style={{ flexShrink: 0 }}
              >
                {agent.name.charAt(0)}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: '18px' }}>{agent.name}</Text>
                <br />
                <Text type="secondary">{agent.description}</Text>
              </div>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text type="secondary">Owner: </Text>
              <Text>{agent.ownerId}</Text>
            </div>
            <div>
              <Text type="secondary">Default Language: </Text>
              <Text>{agent.defaultLanguage}</Text>
            </div>
            <div>
              <Text type="secondary">Knowledge Bases: </Text>
              <Text>{agent.knowledgeBaseFileIds.length} file(s)</Text>
            </div>
            {kbFiles.length > 0 && (
              <div>
                <Text type="secondary">Files: </Text>
                <Space wrap>
                  {kbFiles.map(file => (
                    <Tag key={file.id}>{file.filename}</Tag>
                  ))}
                </Space>
              </div>
            )}
            <div>
              <Text type="secondary">Guardrails: </Text>
              <Space wrap>
                {agent.settings.guardrails.onlyUseKnowledgeBase && (
                  <Tag color="blue">KB Only</Tag>
                )}
                {agent.settings.guardrails.onlyCompanyJobQueries && (
                  <Tag color="blue">Company/Job Only</Tag>
                )}
                {agent.settings.guardrails.mentionSourceDocument && (
                  <Tag color="blue">Mention Sources</Tag>
                )}
              </Space>
            </div>
          </Space>
        </Card>

        {/* Chat Window */}
        <Card title="Test Chat" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '16px',
              padding: '12px',
              background: '#F5F5F5',
              borderRadius: '6px',
              minHeight: '250px',
            }}
          >
            {messages.length === 0 ? (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                This test is not yet live to end users. Start a conversation below.
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
              placeholder="Type your message..."
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
      </Space>
    </Drawer>
  );
}

export default PreviewDrawer;

