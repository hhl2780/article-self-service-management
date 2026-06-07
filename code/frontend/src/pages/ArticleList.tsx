import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, UserInfo } from '../api/auth';
import { Article, deleteArticle, listArticles } from '../api/article';
import { isLoggedIn } from '../store/auth';

export default function ArticleList() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  const loadData = async (nextPage = page, nextSize = size, nextKeyword = keyword) => {
    setLoading(true);
    try {
      const result = await listArticles({ page: nextPage, size: nextSize, keyword: nextKeyword || undefined });
      setArticles(result.content);
      setTotal(result.totalElements);
      setPage(nextPage);
      setSize(nextSize);
    } catch {
      message.error('文章列表加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, size, keyword);
    if (loggedIn) {
      getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canManage = (article: Article) =>
    Boolean(currentUser && (currentUser.role === 'ADMIN' || currentUser.username === article.authorUsername));

  const remove = async (id: number) => {
    try {
      await deleteArticle(id);
      message.success('删除成功');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (value, record) => <Button type="link" onClick={() => navigate(`/articles/${record.id}`)}>{value}</Button>
    },
    {
      title: '作者',
      render: (_, record) => record.authorNickname || record.authorUsername
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/articles/${record.id}`)}>查看</Button>
          {loggedIn && canManage(record) && (
            <>
              <Button icon={<EditOutlined />} onClick={() => navigate(`/articles/${record.id}/edit`)}>编辑</Button>
              <Popconfirm title="确认删除这篇文章？" onConfirm={() => remove(record.id)}>
                <Button danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="page">
      <div className="page-toolbar">
        <Typography.Title level={2}>文章管理</Typography.Title>
        {loggedIn && <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/articles/new')}>新建文章</Button>}
      </div>
      <Space className="search-row">
        <Input
          placeholder="按标题或内容搜索"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onPressEnter={() => loadData(1, size, keyword)}
          allowClear
        />
        <Button icon={<SearchOutlined />} onClick={() => loadData(1, size, keyword)}>搜索</Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={articles}
        pagination={{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextSize) => loadData(nextPage, nextSize, keyword)
        }}
      />
    </div>
  );
}
