import { FileTextOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, isLoggedIn } from '../store/auth';

const { Header, Content } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const menuItems = [
    { key: '/articles', icon: <FileTextOutlined />, label: '文章' },
    ...(loggedIn ? [{ key: '/dashboard', icon: <HomeOutlined />, label: '控制台' }] : [])
  ];

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Typography.Title level={4} className="brand">文章自助管理系统</Typography.Title>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname.startsWith('/dashboard') ? '/dashboard' : '/articles']}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
          className="nav-menu"
        />
        <Space>
          {loggedIn ? (
            <>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/articles/new')}>新建</Button>
              <Button icon={<LogoutOutlined />} onClick={logout}>退出</Button>
            </>
          ) : (
            <>
              <Button icon={<LoginOutlined />} onClick={() => navigate('/login')}>登录</Button>
              <Button type="primary" icon={<UserAddOutlined />} onClick={() => navigate('/register')}>注册</Button>
            </>
          )}
        </Space>
      </Header>
      <Content className="app-content">
        <Outlet />
      </Content>
    </Layout>
  );
}
