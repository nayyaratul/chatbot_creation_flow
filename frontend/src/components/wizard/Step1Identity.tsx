import { Form, Input, Select, Space, Button, Typography, Divider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { AgentFormData } from '../../types/agent';
import AvatarUpload from '../shared/AvatarUpload';

const { TextArea } = Input;
const { Text } = Typography;

interface Step1IdentityProps {
  formData: AgentFormData;
  updateFormData: (updates: Partial<AgentFormData>) => void;
  onNext: () => void;
}

function Step1Identity({ formData, updateFormData, onNext }: Step1IdentityProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    updateFormData({
      name: values.name,
      description: values.description,
      avatarUrl: values.avatarUrl,
      owners: values.owners || [],
      defaultLanguage: values.defaultLanguage || 'English',
      settings: {
        ...formData.settings,
        tasks: values.tasks || '',
        agentRole: values.agentRole || '',
      },
    });
    onNext();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 600 }}>
        Step 1 · Identity & Purpose
      </h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: formData.name,
          description: formData.description,
          avatarUrl: formData.avatarUrl,
          owners: formData.owners,
          defaultLanguage: formData.defaultLanguage,
          tasks: formData.settings.tasks,
          agentRole: formData.settings.agentRole,
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Agent Name"
          name="name"
          rules={[
            { required: true, message: 'Agent name is required' },
            { max: 20, message: 'Name must be 20 characters or less' },
          ]}
        >
          <Input placeholder="Enter agent name" maxLength={20} showCount />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 60, message: 'Description must be 60 characters or less' }]}
        >
          <Input placeholder="Short description" maxLength={60} showCount />
        </Form.Item>

        <Form.Item
          label="Goal / Role & Responsibilities"
          name="tasks"
          tooltip="Describe what this agent does and its main responsibilities"
        >
          <TextArea
            rows={4}
            placeholder="e.g., HR policy assistant for employees"
            maxLength={1500}
            showCount
          />
        </Form.Item>

        <Form.Item label="Agent Avatar" name="avatarUrl">
          <AvatarUpload
            value={formData.avatarUrl}
            onChange={(url) => {
              form.setFieldsValue({ avatarUrl: url });
              updateFormData({ avatarUrl: url });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Owner"
          name="owners"
          tooltip="Additional owners (optional)"
        >
          <Select
            mode="multiple"
            placeholder="Select additional owners"
            options={[
              { label: 'Current User', value: 'user-1' },
              { label: 'Team Member 1', value: 'user-2' },
              { label: 'Team Member 2', value: 'user-3' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Default Language"
          name="defaultLanguage"
          initialValue="English"
        >
          <Select>
            <Select.Option value="English">English</Select.Option>
            <Select.Option value="Hindi" disabled>
              Hindi (Coming in V2)
            </Select.Option>
            <Select.Option value="Spanish" disabled>
              Spanish (Coming in V2)
            </Select.Option>
          </Select>
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
              Next: Behavior
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Step1Identity;

