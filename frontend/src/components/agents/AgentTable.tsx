import { Table, Tag, Dropdown, Button, Space } from 'antd';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import { EyeOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Agent } from '../../types/agent';

interface AgentTableProps {
  agents: Agent[];
  loading: boolean;
  onPreview: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

function AgentTable({ agents, loading, onPreview, onEdit, onDelete }: AgentTableProps) {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});

  const handleFilterChange = (filters: Record<string, FilterValue | null>) => {
    setFilteredInfo(filters);
  };

  const columns: ColumnsType<Agent> = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
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
          <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: '22px', color: '#000000' }}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Draft', value: 'draft' },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Space>
          <Tag
            color={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'default'}
            style={{
              fontSize: '12px',
              lineHeight: '20px',
              padding: '0 8px',
              borderRadius: '4px',
              margin: 0,
            }}
          >
            {status === 'active' ? 'Active' : status === 'draft' ? 'Draft' : 'Inactive'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'ownerId',
      key: 'owner',
      width: 190,
      render: (ownerId) => (
        <span style={{ fontSize: '14px', lineHeight: '22px', color: '#000000' }}>
          {ownerId}
        </span>
      ),
    },
    {
      title: 'Default Language',
      dataIndex: 'defaultLanguage',
      key: 'defaultLanguage',
      width: 112,
      render: (lang) => (
        <span style={{ fontSize: '14px', lineHeight: '22px', color: '#000000' }}>{lang}</span>
      ),
    },
    {
      title: 'Knowledge Bases',
      key: 'knowledgeBases',
      width: 104,
      render: (_, record) => (
        <span style={{ fontSize: '14px', lineHeight: '22px', color: '#000000' }}>
          {record.knowledgeBaseFileIds.length} file(s)
        </span>
      ),
    },
    {
      title: 'Conversations',
      key: 'conversations',
      width: 100,
      render: () => (
        <span style={{ fontSize: '14px', lineHeight: '22px', color: '#000000' }}>0</span>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (date) => (
        <span style={{ fontSize: '14px', lineHeight: '22px', color: '#000000' }}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 118,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onPreview(record)}
            title="Preview"
            style={{ padding: '4px 8px' }}
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
            <Button type="text" icon={<MoreOutlined />} style={{ padding: '4px 8px' }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        overflow: 'auto',
      }}
      className="responsive-table-container"
    >
      <Table
        columns={columns}
        dataSource={agents}
        loading={loading}
        rowKey="id"
        onChange={(_, filters) => handleFilterChange(filters as Record<string, FilterValue | null>)}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} agents`,
          style: { padding: '16px 24px' },
          responsive: true,
          showLessItems: true,
        }}
        rowSelection={{
          type: 'checkbox',
          columnWidth: 32,
        }}
        style={{
          background: '#FFFFFF',
        }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: '#FAFAFA',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  color: '#000000',
                }}
              />
            ),
          },
          body: {
            cell: (props: any) => (
              <td
                {...props}
                style={{
                  ...props.style,
                  padding: '8px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              />
            ),
          },
        }}
      />
    </div>
  );
}

export default AgentTable;

