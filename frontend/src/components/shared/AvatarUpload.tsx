import { useState, useEffect } from 'react';
import { Upload, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(value);

  // Update local state when value prop changes
  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const handleFile = (file: File) => {
    // In a real app, this would upload to a server and return a URL
    // For now, we'll use a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageUrl(url);
      onChange?.(url);
    };
    reader.onerror = () => {
      message.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    // Return false to prevent default upload, handle file manually
    handleFile(file);
    return false;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar
        src={imageUrl}
        size={64}
        icon={!imageUrl ? <UserOutlined /> : undefined}
        style={{ flexShrink: 0 }}
      />
      <Upload
        name="avatar"
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/*"
      >
        <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <UploadOutlined /> Upload Avatar (1:1 ratio)
        </button>
      </Upload>
    </div>
  );
}

export default AvatarUpload;

