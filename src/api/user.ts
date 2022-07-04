import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  userName: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  password: string;
  phone: string;
  shopName: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<string>('/admin/login', data);
}

export function register(data: RegisterData) {
  return axios.post<LoginRes>('/users', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  // return axios.post<UserState>('/api/user/info');
  return axios.get<UserState>('/self');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
