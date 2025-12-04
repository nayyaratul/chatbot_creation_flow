import { Table, Tag, Dropdown, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Agent } from '../../types/agent';

interface AgentTableProps {
  agents: Agent[];
  loading: boolean;
  onPreview: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

function AgentTable({ agents, loading, onPreview, onEdit, onDelete }: AgentTableProps) {
  const columns: ColumnsType<Agent> = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record.avatarUrl && (
            <img
              src={record.avatarUrl}
              alt={text}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'ownerId',
      key: 'owner',
      render: (ownerId) => <span>{ownerId}</span>, // In real app, would fetch user name
    },
    {
      title: 'Default Language',
      dataIndex: 'defaultLanguage',
      key: 'defaultLanguage',
    },
    {
      title: 'Knowledge Bases',
      key: 'knowledgeBases',
      render: (_, record) => (
        <span>{record.knowledgeBaseFileIds.length} file(s)</span>
      ),
    },
    {
      title: 'Conversations',
      key: 'conversations',
      render: () => <span>0</span>, // Placeholder - would come from analytics
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onPreview(record)}
            title="Preview"
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => onEdit(record),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  onClick: () => onDelete(record),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={agents}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} agents`,
      }}
      style={{ background: '#FFFFFF' }}
    />
  );
}

export default AgentTable;

