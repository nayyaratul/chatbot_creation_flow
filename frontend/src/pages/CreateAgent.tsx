import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { agentApi } from '../services/api';
import { Agent, AgentFormData } from '../types/agent';
import WizardLayout from '../components/wizard/WizardLayout';

function CreateAgent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [initialData, setInitialData] = useState<Partial<AgentFormData> | null>(null);

  useEffect(() => {
    if (id) {
      loadAgentData();
    }
  }, [id]);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      const agent = await agentApi.getById(id!);
      setInitialData({
        name: agent.name,
        description: agent.description,
        avatarUrl: agent.avatarUrl,
        owners: agent.owners,
        defaultLanguage: agent.defaultLanguage,
        settings: agent.settings,
        conversationConfig: agent.conversationConfig,
        knowledgeBaseFileIds: agent.knowledgeBaseFileIds,
      });
    } catch (error) {
      message.error('Failed to load agent');
      navigate('/agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: AgentFormData, status: 'active' | 'inactive') => {
    try {
      if (id) {
        await agentApi.update(id, { ...formData, status });
        message.success('Agent updated successfully');
      } else {
        await agentApi.create({ ...formData, status });
        message.success('Agent created successfully');
      }
      navigate('/agents');
    } catch (error) {
      message.error(id ? 'Failed to update agent' : 'Failed to create agent');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WizardLayout
      initialData={initialData}
      isEditMode={!!id}
      onSave={handleSave}
      onCancel={() => navigate('/agents')}
    />
  );
}

export default CreateAgent;

