import { Tag } from 'antd';
import { DatabaseOutlined, CreditCardOutlined } from '@ant-design/icons';

function PageTitleBar() {
  return (
    <div
      style={{
        height: '72px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#FFFFFF',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #8c6fff 0%, #b28ffd 100%)',
          }}
        />
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '28px',
            background: 'linear-gradient(135deg, #8c6fff 0%, #b28ffd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI Labs
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #E9ECF2',
            background: '#FFFFFF',
          }}
        >
          <DatabaseOutlined style={{ fontSize: '20px', color: '#000000' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: '22px', color: '#000000' }}>
            Storage
          </span>
          <Tag
            style={{
              background: '#EBF3FF',
              color: '#0953E5',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '20px',
              padding: '0 8px',
              borderRadius: '4px',
            }}
          >
            45 / 100GB
          </Tag>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #E9ECF2',
            background: '#FFFFFF',
          }}
        >
          <CreditCardOutlined style={{ fontSize: '20px', color: '#585F66' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: '22px', color: '#000000' }}>
            Credits
          </span>
          <Tag
            style={{
              background: '#F9F0FF',
              color: '#9254DE',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '20px',
              padding: '0 8px',
              borderRadius: '4px',
            }}
          >
            7,500
          </Tag>
          <Tag
            style={{
              background: 'rgba(0, 0, 0, 0.02)',
              color: '#292C33',
              border: 'none',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '20px',
              padding: '0 8px',
              borderRadius: '4px',
            }}
          >
            1200 blocked
          </Tag>
        </div>
      </div>
    </div>
  );
}

export default PageTitleBar;

