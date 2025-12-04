import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AgentsList from './pages/AgentsList';
import CreateAgent from './pages/CreateAgent';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Content>
          <Routes>
            <Route path="/agents" element={<AgentsList />} />
            <Route path="/agents/new" element={<CreateAgent />} />
            <Route path="/agents/:id/edit" element={<CreateAgent />} />
            <Route path="/" element={<Navigate to="/agents" replace />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

