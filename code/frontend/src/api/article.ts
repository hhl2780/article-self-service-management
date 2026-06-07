import request, { ApiEnvelope } from './request';

export interface Article {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  authorNickname?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ArticlePayload {
  title: string;
  content: string;
}

export async function listArticles(params: { page: number; size: number; keyword?: string }) {
  const { data } = await request.get<ApiEnvelope<PageResult<Article>>>('/articles', { params });
  return data.data;
}

export async function getArticle(id: string | number) {
  const { data } = await request.get<ApiEnvelope<Article>>(`/articles/${id}`);
  return data.data;
}

export async function createArticle(payload: ArticlePayload) {
  const { data } = await request.post<ApiEnvelope<Article>>('/articles', payload);
  return data.data;
}

export async function updateArticle(id: string | number, payload: ArticlePayload) {
  const { data } = await request.put<ApiEnvelope<Article>>(`/articles/${id}`, payload);
  return data.data;
}

export async function deleteArticle(id: string | number) {
  await request.delete<ApiEnvelope<null>>(`/articles/${id}`);
}
