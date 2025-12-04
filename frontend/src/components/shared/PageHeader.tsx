import { Breadcrumb, Badge, Avatar } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

function PageHeader() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '8px 24px',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Breadcrumb
        items={[
          {
            title: <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>All clients</span>,
          },
          {
            title: <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Reliance</span>,
          },
        ]}
        separator="/"
        style={{ fontSize: '14px' }}
      />
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.02)',
          }}
        >
          <BellOutlined style={{ fontSize: '16px', color: '#000000' }} />
          <Badge
            count={21}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
            }}
          />
        </div>
        <Avatar
          icon={<UserOutlined />}
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
}

export default PageHeader;

