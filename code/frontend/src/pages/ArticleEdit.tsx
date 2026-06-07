import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../api/article';

export default function ArticleEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = useMemo(() => Boolean(id), [id]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getArticle(id)
        .then((article) => form.setFieldsValue({ title: article.title, content: article.content }))
        .catch(() => message.error('文章加载失败'));
    }
  }, [form, id]);

  const onFinish = async (values: { title: string; content: string }) => {
    setLoading(true);
    try {
      const article = editing && id ? await updateArticle(id, values) : await createArticle(values);
      message.success('保存成功');
      navigate(`/articles/${article.id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Card>
        <Typography.Title level={2}>{editing ? '编辑文章' : '新建文章'}</Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea rows={14} />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>保存</Button>
            <Button onClick={() => navigate('/articles')}>取消</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
