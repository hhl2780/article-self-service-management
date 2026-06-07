import { FileTextOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, UserInfo } from '../api/auth';
import { listArticles } from '../api/article';
import { clearToken } from '../store/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    Promise.all([getCurrentUser(), listArticles({ page: 1, size: 1 })])
      .then(([userInfo, articles]) => {
        setUser(userInfo);
        setArticleCount(articles.totalElements);
      })
      .catch(() => message.error('加载控制台数据失败'));
  }, []);

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="page">
      <Space direction="vertical" size="large" className="full-width">
        <Typography.Title level={2}>控制台</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <Statistic title="当前用户" value={user?.nickname || user?.username || '-'} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Statistic title="文章数量" value={articleCount} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
        </Row>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/articles/new')}>新建文章</Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate('/articles')}>文章列表</Button>
          <Button onClick={logout}>退出登录</Button>
        </Space>
      </Space>
    </div>
  );
}
