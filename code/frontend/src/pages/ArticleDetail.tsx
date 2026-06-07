import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, UserInfo } from '../api/auth';
import { Article, getArticle } from '../api/article';
import { isLoggedIn } from '../store/auth';

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (!id) return;
    getArticle(id)
      .then(setArticle)
      .catch(() => message.error('文章详情加载失败'));
    if (isLoggedIn()) {
      getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
    }
  }, [id]);

  if (!article) {
    return <div className="page">加载中...</div>;
  }

  const canManage = currentUser && (currentUser.role === 'ADMIN' || currentUser.username === article.authorUsername);

  return (
    <div className="page article-detail">
      <Space direction="vertical" size="large" className="full-width">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/articles')}>返回列表</Button>
          {canManage && <Button icon={<EditOutlined />} onClick={() => navigate(`/articles/${article.id}/edit`)}>编辑</Button>}
        </Space>
        <Card>
          <Typography.Title level={2}>{article.title}</Typography.Title>
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="作者">{article.authorNickname || article.authorUsername}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          </Descriptions>
          <Typography.Paragraph className="article-content">{article.content}</Typography.Paragraph>
        </Card>
      </Space>
    </div>
  );
}
