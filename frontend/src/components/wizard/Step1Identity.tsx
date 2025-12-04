import { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { AgentFormData } from '../../types/agent';
import AvatarUpload from '../shared/AvatarUpload';

const { TextArea } = Input;

interface Step1IdentityProps {
  formData: AgentFormData;
  updateFormData: (updates: Partial<AgentFormData>) => void;
  onNext: () => void;
}

export interface Step1IdentityRef {
  submit: () => void;
  getCurrentValues: () => any;
}

const Step1Identity = forwardRef<Step1IdentityRef, Step1IdentityProps>(
  ({ formData, updateFormData, onNext }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
      getCurrentValues: () => {
        return form.getFieldsValue();
      },
    }));

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
        // agentRole is handled in Step2Behavior, not here
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
          // agentRole is handled in Step2Behavior, not here
        }}
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
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
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ max: 60, message: 'Description must be 60 characters or less' }]}
            >
              <Input placeholder="Short description" maxLength={60} showCount />
            </Form.Item>
          </Col>
        </Row>

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

        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
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
          </Col>
          <Col xs={24} sm={24} md={12}>
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
          </Col>
        </Row>
      </Form>
    </div>
  );
});

Step1Identity.displayName = 'Step1Identity';

export default Step1Identity;

