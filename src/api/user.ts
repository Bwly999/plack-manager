import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  phone: string;
  shopName: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<string>('/user/admin/login/', data);
}

export function register(data: RegisterData) {
  return axios.post<LoginRes>('/user/admin', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  // return axios.post<UserState>('/api/user/info');
  return axios.get<UserState>('/user/admin/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
