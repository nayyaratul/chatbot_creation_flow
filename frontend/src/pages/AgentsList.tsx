import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { agentApi } from '../services/api';
import { Agent } from '../types/agent';
import AgentTable from '../components/agents/AgentTable';
import PreviewDrawer from '../components/agents/PreviewDrawer';
import CreateAgentCard from '../components/agents/CreateAgentCard';
import Sidebar from '../components/shared/Sidebar';
import PageHeader from '../components/shared/PageHeader';
import PageTitleBar from '../components/shared/PageTitleBar';
import StatsCards from '../components/shared/StatsCards';
import { message } from 'antd';

const { Content } = Layout;

function AgentsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewAgent, setPreviewAgent] = useState<Agent | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-agent');

  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentApi.getAll();
      const agentsArray = Array.isArray(data) ? data : [];
      setAgents(agentsArray);
    } catch (error) {
      message.error('Failed to load agents');
      console.error('Error loading agents:', error);
      setAgents([]); // Set empty array on error to prevent stuck loading state
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load agents when component mounts, route changes, or tab changes
    if (location.pathname === '/agents' && activeTab === 'ai-agent') {
      loadAgents();
    } else if (location.pathname !== '/agents') {
      // Reset loading state if not on agents route
      setLoading(false);
    }
  }, [location.pathname, activeTab, loadAgents]);

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

  const activeCount = agents.filter((a) => a.status === 'active').length;

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }} className="responsive-layout">
      <Sidebar />
      <Layout style={{ marginLeft: 0 }} className="responsive-main-layout">
        <PageHeader />
        <PageTitleBar />
        <Content
          style={{
            padding: '24px',
            paddingTop: '8px',
            background: '#F5F5F5',
            minHeight: 'calc(100vh - 132px)',
          }}
          className="responsive-content"
        >
          <div style={{ maxWidth: '1128px', margin: '0 auto', width: '100%' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                },
                {
                  key: 'knowledge-base',
                  label: 'Knowledge Base',
                },
                {
                  key: 'ai-agent',
                  label: 'AI Agent',
                },
                {
                  key: 'credits',
                  label: 'Credits',
                },
              ]}
              style={{ marginBottom: '0', marginTop: '0' }}
              className="responsive-tabs"
            />
            {activeTab === 'ai-agent' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0',
                    marginTop: '0',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingTop: '0',
                    paddingBottom: '16px',
                  }}
                  className="responsive-header"
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        lineHeight: '28px',
                        color: '#000000',
                        marginBottom: '4px',
                      }}
                    >
                      AI Agents
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        color: '#8C8C8C',
                      }}
                    >
                      Manage and monitor your AI Agents
                    </p>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateAgent}
                    style={{
                      height: '32px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '22px',
                      padding: '0 15px',
                      boxShadow: '0px 2px 0px 0px rgba(5, 145, 255, 0.1)',
                    }}
                  >
                    Create Agent
                  </Button>
                </div>
                {!loading && agents.length > 0 && <StatsCards activeCount={activeCount} />}
                {agents.length === 0 && !loading ? (
                  <CreateAgentCard onCreateAgent={handleCreateAgent} />
                ) : (
                  <AgentTable
                    agents={agents}
                    loading={loading}
                    onPreview={handlePreview}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </>
            )}
            {activeTab === 'overview' && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#8C8C8C' }}>
                Overview content coming soon
              </div>
            )}
            {activeTab === 'knowledge-base' && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#8C8C8C' }}>
                Knowledge Base content coming soon
              </div>
            )}
            {activeTab === 'credits' && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#8C8C8C' }}>
                Credits content coming soon
              </div>
            )}
          </div>
        </Content>
      </Layout>
      <PreviewDrawer
        agent={previewAgent}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </Layout>
  );
}

export default AgentsList;

