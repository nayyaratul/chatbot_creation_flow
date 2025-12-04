import { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Space, Input, Button, Typography, Divider, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { AgentFormData } from '../../types/agent';
import { previewApi } from '../../services/api';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface PreviewPanelProps {
  formData: AgentFormData;
}

function PreviewPanel({ formData }: PreviewPanelProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await previewApi.generate({
        agentConfig: {
          name: formData.name || 'Agent',
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

  // Generate sample response preview
  const getSampleResponse = () => {
    if (!formData.name) return 'Enter agent details to see preview...';
    
    const temp = formData.settings.temperature;
    const tone = formData.settings.tone;
    
    if (temp < 0.3) {
      return 'Based on the available information, the relevant details are as follows...';
    } else if (temp < 0.7) {
      return tone === 'soft'
        ? "I'd be happy to help with that! Let me check the information available to me."
        : 'I can assist with that. According to the available documentation...';
    } else {
      return tone === 'soft'
        ? "Oh, that's a great question! I'm here to help you with that."
        : 'Thank you for your inquiry. I\'ve reviewed the relevant documentation...';
    }
  };

  return (
    <Card title="Live Preview" style={{ position: 'sticky', top: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Bot Identity Card */}
        <div>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                src={formData.avatarUrl}
                size={48}
                style={{ flexShrink: 0 }}
              >
                {formData.name?.charAt(0) || 'A'}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ fontSize: '16px', display: 'block' }}>
                  {formData.name || 'Agent Name'}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formData.description || 'Agent description'}
                </Text>
              </div>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Tone: </Text>
              <Tag size="small">{formData.settings.tone === 'soft' ? 'Soft' : 'Professional'}</Tag>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Response Style: </Text>
              <Text style={{ fontSize: '12px' }}>
                {formData.settings.temperature < 0.3
                  ? 'Factual'
                  : formData.settings.temperature < 0.7
                  ? 'Balanced'
                  : 'Creative'}
              </Text>
            </div>
          </Space>
        </div>

        {/* Sample Response Preview */}
        <div>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Sample Response:
          </Text>
          <div
            style={{
              padding: '12px',
              background: '#F5F5F5',
              borderRadius: '6px',
              minHeight: '60px',
            }}
          >
            <Text style={{ fontSize: '13px' }}>{getSampleResponse()}</Text>
          </div>
        </div>

        {/* Mini Chat */}
        <div>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Test Chat:
          </Text>
          <div
            style={{
              height: '200px',
              overflowY: 'auto',
              marginBottom: '8px',
              padding: '8px',
              background: '#F5F5F5',
              borderRadius: '6px',
              border: '1px solid #D9D9D9',
            }}
          >
            {messages.length === 0 ? (
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Start a conversation to test the agent
              </Text>
            ) : (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
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
                        padding: '6px 10px',
                        borderRadius: '4px',
                        background: msg.role === 'user' ? '#1677FF' : '#FFFFFF',
                        color: msg.role === 'user' ? '#FFFFFF' : '#1F1F1F',
                        fontSize: '12px',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Typing...
                  </Text>
                )}
              </Space>
            )}
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="Type a message..."
              size="small"
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              disabled={!inputValue.trim()}
              size="small"
            />
          </Space.Compact>
        </div>
      </Space>
    </Card>
  );
}

export default PreviewPanel;

