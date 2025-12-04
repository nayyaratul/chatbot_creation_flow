import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, PageHeader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { agentApi } from '../services/api';
import { Agent } from '../types/agent';
import AgentTable from '../components/agents/AgentTable';
import PreviewDrawer from '../components/agents/PreviewDrawer';
import CreateAgentCard from '../components/agents/CreateAgentCard';
import { message } from 'antd';

const { Header, Content } = Layout;

function AgentsList() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewAgent, setPreviewAgent] = useState<Agent | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await agentApi.getAll();
      setAgents(data);
    } catch (error) {
      message.error('Failed to load agents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = () => {
    navigate('/agents/new');
  };

  const handlePreview = (agent: Agent) => {
    setPreviewAgent(agent);
    setDrawerVisible(true);
  };

  const handleEdit = (agent: Agent) => {
    navigate(`/agents/${agent.id}/edit`);
  };

  const handleDelete = async (agent: Agent) => {
    try {
      await agentApi.delete(agent.id);
      message.success('Agent deleted successfully');
      loadAgents();
    } catch (error) {
      message.error('Failed to delete agent');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Header style={{ background: '#FFFFFF', padding: '0 24px', borderBottom: '1px solid #D9D9D9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: '#1F1F1F' }}>AI Agents</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateAgent}
            size="large"
          >
            Create Agent
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        {agents.length === 0 && !loading ? (
          <CreateAgentCard onCreateAgent={handleCreateAgent} />
        ) : (
          <>
            {agents.length === 0 ? null : (
              <CreateAgentCard onCreateAgent={handleCreateAgent} inline />
            )}
            <AgentTable
              agents={agents}
              loading={loading}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </Content>
      <PreviewDrawer
        agent={previewAgent}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </Layout>
  );
}

export default AgentsList;

