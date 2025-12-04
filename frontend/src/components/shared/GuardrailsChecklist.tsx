import { Checkbox, Typography, Space, Alert } from 'antd';
import { Guardrails } from '../../types/agent';

const { Text } = Typography;

interface GuardrailsChecklistProps {
  value: Guardrails;
  onChange: (guardrails: Guardrails) => void;
}

function GuardrailsChecklist({ value, onChange }: GuardrailsChecklistProps) {
  const handleChange = (key: keyof Guardrails, checked: boolean) => {
    onChange({ ...value, [key]: checked });
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Text strong style={{ display: 'block', marginBottom: '12px' }}>
          Guardrail Templates
        </Text>
        <Space direction="vertical" size="small">
          <Checkbox
            checked={value.onlyUseKnowledgeBase}
            onChange={(e) => handleChange('onlyUseKnowledgeBase', e.target.checked)}
          >
            Only reply using attached knowledge base & company policy
          </Checkbox>
          <Checkbox
            checked={value.onlyCompanyJobQueries}
            onChange={(e) => handleChange('onlyCompanyJobQueries', e.target.checked)}
          >
            Only answer queries related to company or job
          </Checkbox>
          <Checkbox
            checked={value.mentionSourceDocument}
            onChange={(e) => handleChange('mentionSourceDocument', e.target.checked)}
          >
            Mention which document the answer came from (when applicable)
          </Checkbox>
        </Space>
      </div>
      <Alert
        message="Always-on Defaults"
        description={
          <Space direction="vertical" size="small" style={{ fontSize: '12px' }}>
            <Text>• Maintain polite, professional tone</Text>
            <Text>• Avoid legal, medical, financial advice</Text>
            <Text>• If unsure, say you don't know</Text>
            <Text>• If out-of-scope, guide user to next step</Text>
          </Space>
        }
        type="info"
        showIcon
        style={{ fontSize: '12px' }}
      />
    </Space>
  );
}

export default GuardrailsChecklist;

