import request, { ApiEnvelope } from './request';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  nickname?: string;
}

export interface AuthResult {
  token: string;
  username: string;
  nickname?: string;
  role: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  role: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await request.post<ApiEnvelope<AuthResult>>('/auth/login', payload);
  return data.data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await request.post<ApiEnvelope<UserInfo>>('/auth/register', payload);
  return data.data;
}

export async function getCurrentUser() {
  const { data } = await request.get<ApiEnvelope<UserInfo>>('/users/me');
  return data.data;
}
