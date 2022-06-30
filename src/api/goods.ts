/* eslint-disable prettier/prettier */
import axios from 'axios';
import qs from 'query-string';

export interface GoodsRecord {
  id: string;
  name: string;
  coverImgUrl: string;
  videoUrl: string;
  scollImages: string[];
  price: number;
  discountPrice: number;
  stock: number;
  descImgUrlList: string[];
  originPlace: string;
  level: string;
  weight: number;
  desc: string;
  category: string;
  shopId: string;
}

export interface GoodsParams extends Partial<GoodsRecord> {
  page: number;
  pageSize: number;
}

export interface GoodsListRes {
  content: GoodsRecord[];
  totalElements: number;
}

export type PartialGoods = Partial<GoodsRecord>

export function listGoodsPages(shopId: string, params: GoodsParams) {
  return axios.get<GoodsListRes>(`/goods/goods/shopId/${shopId}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getGoodsById(goodsId: string) {
  return axios.get<GoodsListRes>(`/goods/goods/${goodsId}`);
}

export function deleteGoods(id: string) {
  return axios.delete(`/goods/${id}`);
}

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/goods/goods/file', 
    formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }}
  );
}

export function deleteFile(url: string) {
  return axios.delete('/goods/file', {
    params: {url}
  });
}

export function onshelfGoods(goods: Partial<GoodsRecord> ) {
  return axios.post('/goods/goods', goods);
}

export function updateGoods(goodsId: string, goods: Partial<GoodsRecord> ) {
  return axios.put(`/goods/goods/${goodsId}`, goods);
}
