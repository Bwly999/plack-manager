/* eslint-disable prettier/prettier */
import axios from 'axios';
import qs from 'query-string';

export interface Address {
    consignee: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detailAddress: string;
}

export interface OrderRecord {
  id: string
  logisticsNumber: string
  isSelf: boolean
  payWay: number
  address: Address
  payNumber: number
  payAmount: number
  userId: string
  goods: {
    id: string
    name: string
    coverImgUrl: string
  }
  shopId: string
  shopName: string
  state: number
  comment: {
    userId: string
    avatarUrl: string
    nickName: string
    rate: number
    createdTime: Date
    content: string
  }
  createdTime: Date
  modifiedTime: Date
}

export type PartialOrder = Partial<OrderRecord>

export interface OrderParams {
  goodsId?: string
  goodsName?: string
  state?: number
  payWay?: number
  page?: number
  pageSize?: number
}

export interface OrderListRes {
  content: OrderRecord[]
  totalElements: number
}



export function listOrderPages(params: OrderParams) {
  return axios.get<OrderListRes>('/goods/orders', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}