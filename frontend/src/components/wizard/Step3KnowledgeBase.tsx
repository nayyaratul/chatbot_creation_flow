import { useState, useEffect } from 'react';
import { Form, Input, Table, Checkbox, Space, Button, Card, Typography, Tag, Empty, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { AgentFormData, KnowledgeBaseFile } from '../../types/agent';
import { knowledgeBaseApi } from '../../services/api';

const { Search } = Input;
const { Text, Paragraph } = Typography;

interface Step3KnowledgeBaseProps {
  formData: AgentFormData;
  updateFormData: (updates: Partial<AgentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function Step3KnowledgeBase({ formData, updateFormData, onNext, onPrev }: Step3KnowledgeBaseProps) {
  const [kbFiles, setKbFiles] = useState<KnowledgeBaseFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<KnowledgeBaseFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(formData.knowledgeBaseFileIds);
  const [selectedFileDetail, setSelectedFileDetail] = useState<KnowledgeBaseFile | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [kbFiles, searchText, selectedFiles]);

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

  const handleSelectFile = (fileId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedFiles, fileId]
      : selectedFiles.filter(id => id !== fileId);
    
    setSelectedFiles(newSelected);
    updateFormData({ knowledgeBaseFileIds: newSelected });
    
    if (selectedFileDetail?.id === fileId && !checked) {
      setSelectedFileDetail(null);
    }
  };

  const handleRowClick = (file: KnowledgeBaseFile) => {
    setSelectedFileDetail(file);
  };

  const handleRemoveFile = (fileId: string) => {
    const newSelected = selectedFiles.filter(id => id !== fileId);
    setSelectedFiles(newSelected);
    updateFormData({ knowledgeBaseFileIds: newSelected });
    
    if (selectedFileDetail?.id === fileId) {
      setSelectedFileDetail(null);
    }
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setSelectedFileDetail(null);
    updateFormData({ knowledgeBaseFileIds: [] });
  };

  const handleNext = () => {
    if (selectedFiles.length === 0) {
      message.error('Attach at least one knowledge base so the agent has context.');
      return;
    }
    onNext();
  };

  const columns: ColumnsType<KnowledgeBaseFile> = [
    {
      title: '',
      dataIndex: 'id',
      width: 50,
      render: (id: string) => (
        <Checkbox
          checked={selectedFiles.includes(id)}
          onChange={(e) => handleSelectFile(id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
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
        {/* Search */}
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

        {/* Main Content: Table and Selected Files Side by Side */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Left: KB Table */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Table
              columns={columns}
              dataSource={filteredFiles}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: 'pointer' },
              })}
              locale={{
                emptyText: <Empty description="No knowledge bases found" />,
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* Right: Selected Files Card */}
          <div style={{ flex: '0 0 280px', minWidth: 280 }}>
            <Card
              title={`Selected Files (${selectedFiles.length})`}
              extra={
                selectedFiles.length > 0 && (
                  <Button type="link" danger size="small" onClick={handleRemoveAll}>
                    Remove all
                  </Button>
                )
              }
              style={{ position: 'sticky', top: '16px' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {selectedFiles.length === 0 ? (
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    No files selected
                  </Text>
                ) : (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {selectedFileObjects.map(file => (
                      <Tag
                        key={file.id}
                        closable
                        onClose={() => handleRemoveFile(file.id)}
                        style={{ 
                          marginBottom: '4px', 
                          padding: '4px 8px',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {file.filename}
                        </span>
                      </Tag>
                    ))}
                  </Space>
                )}

                {selectedFileDetail && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#F5F5F5', borderRadius: '6px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                      File Details
                    </Text>
                    <Paragraph style={{ marginBottom: '4px', fontSize: '12px' }}>
                      <Text type="secondary">Name: </Text>
                      <Text style={{ fontSize: '12px' }}>{selectedFileDetail.filename}</Text>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '4px', fontSize: '12px' }}>
                      <Text type="secondary">Description: </Text>
                      <Text style={{ fontSize: '12px' }}>{selectedFileDetail.description}</Text>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '4px', fontSize: '12px' }}>
                      <Text type="secondary">Type: </Text>
                      <Tag size="small">{selectedFileDetail.fileType}</Tag>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '4px', fontSize: '12px' }}>
                      <Text type="secondary">Uploaded: </Text>
                      <Text style={{ fontSize: '12px' }}>{selectedFileDetail.uploadedOn}</Text>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 0, fontSize: '12px' }}>
                      <Text type="secondary">By: </Text>
                      <Text style={{ fontSize: '12px' }}>{selectedFileDetail.uploadedBy}</Text>
                    </Paragraph>
                  </div>
                )}
              </Space>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Button type="primary" onClick={handleNext} icon={<ArrowRightOutlined />}>
            Next: Summary
          </Button>
        </div>
      </Space>
    </div>
  );
}

export default Step3KnowledgeBase;

