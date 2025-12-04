import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CreateAgentCardProps {
  onCreateAgent: () => void;
  inline?: boolean;
}

function CreateAgentCard({ onCreateAgent, inline }: CreateAgentCardProps) {
  if (inline) {
    return (
      <Card
        style={{
          marginBottom: '24px',
          textAlign: 'center',
          background: '#E6F4FF',
          border: '1px dashed #1677FF',
        }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ marginBottom: '8px', color: '#1F1F1F' }}>Create your first Agent</h3>
          <p style={{ marginBottom: '16px', color: '#8C8C8C' }}>
            Get started by creating an AI agent to help your team
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateAgent}
            size="large"
          >
            Create Agent
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card
        style={{
          maxWidth: '500px',
          textAlign: 'center',
          background: '#FFFFFF',
          border: '1px solid #D9D9D9',
        }}
      >
        <div style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 600, color: '#1F1F1F' }}>
            Create your first Agent
          </h2>
          <p style={{ marginBottom: '24px', color: '#8C8C8C', fontSize: '14px' }}>
            No agents yet. Create your first one to help your team.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateAgent}
            size="large"
          >
            Create Agent
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default CreateAgentCard;

