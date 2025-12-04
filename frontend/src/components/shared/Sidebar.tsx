import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'ai-labs',
      icon: <MailOutlined />,
      label: 'AI Labs',
    },
    {
      key: 'todos',
      icon: <MailOutlined />,
      label: "To do's",
    },
    {
      key: 'delete-checks',
      icon: <MailOutlined />,
      label: 'Delete Checks',
    },
    {
      key: 'compliance',
      icon: <MailOutlined />,
      label: 'Compliance',
    },
    {
      key: 'business-workflows',
      icon: <MailOutlined />,
      label: 'Business workflows',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'ai-labs':
        navigate('/agents');
        break;
      case 'todos':
      case 'delete-checks':
      case 'compliance':
      case 'business-workflows':
        // Navigate to respective pages when implemented
        break;
      default:
        break;
    }
  };

  const getSelectedKey = () => {
    // AI Labs is always selected when on agents page
    if (location.pathname.startsWith('/agents')) {
      return 'ai-labs';
    }
    return 'ai-labs'; // Default to AI Labs
  };

  return (
    <Sider
      width={264}
      style={{
        background: '#1F1F1F',
        minHeight: '100vh',
        borderRight: 'none',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          background: '#1F1F1F',
          paddingTop: '8px',
        }}
        theme="dark"
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;

