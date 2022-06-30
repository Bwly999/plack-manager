import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function listCategory() {
  return axios.get<any>(`/goods/goods/category/`);
}
