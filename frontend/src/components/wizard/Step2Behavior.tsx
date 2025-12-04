import { Form, Input, Radio, Space, Button, Typography, Divider, InputNumber, Switch, TimePicker } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AgentFormData } from '../../types/agent';
import TemperatureSlider from '../shared/TemperatureSlider';
import GuardrailsChecklist from '../shared/GuardrailsChecklist';

const { TextArea } = Input;
const { Text } = Typography;

interface Step2BehaviorProps {
  formData: AgentFormData;
  updateFormData: (updates: Partial<AgentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function Step2Behavior({ formData, updateFormData, onNext, onPrev }: Step2BehaviorProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    updateFormData({
      settings: {
        ...formData.settings,
        tasks: values.tasks || '',
        agentRole: values.agentRole || '',
        tone: values.tone,
        firstMessage: values.firstMessage,
        temperature: values.temperature,
        guardrails: values.guardrails,
        fallbackMessage: values.fallbackMessage,
      },
      conversationConfig: {
        ...formData.conversationConfig,
        silenceTimeout: values.silenceTimeout,
        maxDuration: values.hasMaxDuration ? values.maxDuration?.format('HH:mm') : undefined,
        maxLength: values.maxLength,
      },
    });
    onNext();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 600 }}>
        Step 2 · Behavior & Conversation Settings
      </h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tasks: formData.settings.tasks,
          agentRole: formData.settings.agentRole,
          tone: formData.settings.tone,
          firstMessage: formData.settings.firstMessage,
          temperature: formData.settings.temperature,
          guardrails: formData.settings.guardrails,
          fallbackMessage: formData.settings.fallbackMessage,
          silenceTimeout: formData.conversationConfig.silenceTimeout,
          hasMaxDuration: !!formData.conversationConfig.maxDuration,
          maxDuration: formData.conversationConfig.maxDuration
            ? dayjs(formData.conversationConfig.maxDuration, 'HH:mm')
            : undefined,
          maxLength: formData.conversationConfig.maxLength,
        }}
        onFinish={handleFinish}
      >
        <div style={{ marginBottom: '32px' }}>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Personality & Tone
          </Text>

          <Form.Item
            label="Tasks of the Agent"
            name="tasks"
            rules={[{ max: 1500, message: 'Tasks must be 1500 characters or less' }]}
          >
            <TextArea
              rows={6}
              placeholder="Describe the specific tasks and responsibilities of this agent..."
              maxLength={1500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Agent Role"
            name="agentRole"
            tooltip="e.g., HR Assistant, Learning Guide"
          >
            <Input placeholder="Enter agent role" />
          </Form.Item>

          <Form.Item
            label="Tone of Voice"
            name="tone"
            rules={[{ required: true, message: 'Please select a tone' }]}
          >
            <Radio.Group>
              <Radio value="soft">Soft</Radio>
              <Radio value="professional">Professional</Radio>
            </Radio.Group>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
              More tones coming in V2
            </Text>
          </Form.Item>

          <Form.Item
            label="First Message"
            name="firstMessage"
            rules={[
              { required: true, message: 'First message is required' },
              { max: 150, message: 'First message must be 150 characters or less' },
            ]}
            tooltip="Default: Hi {user_name}, I am {agent_name}. How can I help you today?"
          >
            <Input
              placeholder="Hi {user_name}, I am {agent_name}. How can I help you today?"
              maxLength={150}
              showCount
            />
          </Form.Item>
        </div>

        <Divider />

        <div style={{ marginBottom: '32px' }}>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Guardrails & Safety
          </Text>
          <Form.Item name="guardrails">
            <GuardrailsChecklist
              value={formData.settings.guardrails}
              onChange={(guardrails) => {
                form.setFieldsValue({ guardrails });
                updateFormData({
                  settings: { ...formData.settings, guardrails },
                });
              }}
            />
          </Form.Item>
        </div>

        <Divider />

        <div style={{ marginBottom: '32px' }}>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Response Style
          </Text>
          <Form.Item name="temperature">
            <TemperatureSlider
              value={formData.settings.temperature}
              onChange={(temperature) => {
                form.setFieldsValue({ temperature });
                updateFormData({
                  settings: { ...formData.settings, temperature },
                });
              }}
            />
          </Form.Item>
        </div>

        <Divider />

        <div style={{ marginBottom: '32px' }}>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Conversation Behavior
          </Text>

          <Form.Item
            label="Chat Mode"
            tooltip="Voice modes coming soon"
          >
            <Radio.Group disabled value="text-to-text">
              <Radio value="text-to-text">Text-to-Text</Radio>
            </Radio.Group>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Voice modes coming soon
            </Text>
          </Form.Item>

          <Form.Item
            label="Fallback Message"
            name="fallbackMessage"
            tooltip="Message shown when agent cannot answer"
          >
            <TextArea
              rows={3}
              placeholder="The bot must not guess or invent information..."
            />
          </Form.Item>

          <Form.Item
            label="Silence Timeout"
            name="silenceTimeout"
            rules={[
              { required: true, message: 'Silence timeout is required' },
              { type: 'number', min: 5, message: 'Minimum 5 seconds' },
            ]}
            tooltip="Auto-end conversation after X seconds of inactivity (0 = no auto-end)"
          >
            <InputNumber
              min={5}
              placeholder="15"
              addonAfter="seconds"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Max Conversation Duration"
            name="hasMaxDuration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.hasMaxDuration !== currentValues.hasMaxDuration
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('hasMaxDuration') ? (
                <Form.Item
                  name="maxDuration"
                  rules={[{ required: true, message: 'Please select max duration' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            label="Max Response Length"
            name="maxLength"
            rules={[
              { required: true, message: 'Max response length is required' },
              { type: 'number', min: 50, message: 'Minimum 50 words' },
            ]}
            tooltip="Maximum number of words in a response"
          >
            <InputNumber
              min={50}
              placeholder="100"
              addonAfter="words"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>

        <Divider />

        <Form.Item>
          <Space>
            <Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
            <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
              Next: Knowledge Base
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Step2Behavior;

