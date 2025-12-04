import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Input, Table, Space, Button, Drawer, Typography, Tag, Empty, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { AgentFormData, KnowledgeBaseFile } from '../../types/agent';
import { knowledgeBaseApi } from '../../services/api';

const { Search } = Input;
const { Text } = Typography;

interface Step3KnowledgeBaseProps {
  formData: AgentFormData;
  updateFormData: (updates: Partial<AgentFormData>) => void;
  onNext: () => void;
}

export interface Step3KnowledgeBaseRef {
  submit: () => void;
}

const Step3KnowledgeBase = forwardRef<Step3KnowledgeBaseRef, Step3KnowledgeBaseProps>(
  ({ formData, updateFormData, onNext }, ref) => {
  const [kbFiles, setKbFiles] = useState<KnowledgeBaseFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<KnowledgeBaseFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(formData.knowledgeBaseFileIds);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [kbFiles, searchText]);

  const loadKnowledgeBases = async () => {
    try {
      setLoading(true);
      const files = await knowledgeBaseApi.getAll();
      setKbFiles(files);
      setFilteredFiles(files);
    } catch (error) {
      message.error('Failed to load knowledge bases');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = () => {
    let filtered = kbFiles;
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        file =>
          file.filename.toLowerCase().includes(searchLower) ||
          file.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredFiles(filtered);
  };

  const handleRemoveFile = (fileId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = selectedFiles.filter(id => id !== fileId);
    setSelectedFiles(newSelected);
    updateFormData({ knowledgeBaseFileIds: newSelected });
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleNext = () => {
    if (selectedFiles.length === 0) {
      message.error('Attach at least one knowledge base so the agent has context.');
      return;
    }
    onNext();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleNext();
    },
  }));

  const columns: ColumnsType<KnowledgeBaseFile> = [
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
      sorter: (a, b) => a.filename.localeCompare(b.filename),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Uploaded On',
      dataIndex: 'uploadedOn',
      key: 'uploadedOn',
      sorter: (a, b) => a.uploadedOn.localeCompare(b.uploadedOn),
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
  ];

  const selectedFileObjects = kbFiles.filter(file => selectedFiles.includes(file.id));

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 600 }}>
        Step 3 · Knowledge Base Selection
      </h2>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Add Knowledge Base Button */}
        <div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
            size="large"
            style={{ width: '100%', height: '48px' }}
          >
            Add Knowledge Base
          </Button>
        </div>

        {/* Selected Knowledge Bases Display */}
        {selectedFiles.length > 0 && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '14px' }}>
              Selected Knowledge Bases ({selectedFiles.length})
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedFileObjects.map(file => (
                <Tag
                  key={file.id}
                  closable
                  onClose={(e) => handleRemoveFile(file.id, e)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                  }}
                >
                  {file.filename}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Drawer for Knowledge Base Selection */}
        <Drawer
          title="Select Knowledge Base"
          placement="right"
          onClose={handleDrawerClose}
          open={drawerVisible}
          width={600}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Search
              placeholder="Search by file name or description"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onSearch={filterFiles}
              allowClear
              style={{ width: '100%' }}
            />

            <Table
              columns={columns}
              dataSource={filteredFiles}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              locale={{
                emptyText: <Empty description="No knowledge bases found" />,
              }}
              scroll={{ x: 'max-content' }}
              rowSelection={{
                selectedRowKeys: selectedFiles,
                onChange: (selectedRowKeys) => {
                  setSelectedFiles(selectedRowKeys as string[]);
                  updateFormData({ knowledgeBaseFileIds: selectedRowKeys as string[] });
                },
                type: 'checkbox',
              }}
            />
          </Space>
        </Drawer>
      </Space>
    </div>
  );
});

Step3KnowledgeBase.displayName = 'Step3KnowledgeBase';

export default Step3KnowledgeBase;

