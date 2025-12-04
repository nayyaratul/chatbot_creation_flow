import { useState } from 'react';
import { Upload, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(value);

  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      // In a real app, this would upload to a server and return a URL
      // For now, we'll use a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        onChange?.(url);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error('Upload failed');
    }
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
    return true;
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
        onChange={handleChange}
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

