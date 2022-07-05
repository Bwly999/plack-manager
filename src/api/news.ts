import axios from 'axios';
import qs from 'query-string';

// eslint-disable-next-line import/prefer-default-export

export interface News {
  id: number;
  newsTitle: string;
  newsType: string;
  author: string;
  content: string;
}
export type PartialNews = Partial<News>;

type NewsOrder = 'asc' | 'desc';
export interface NewsParam {
  title?: string;
  type?: string;
  author?: string;
  content?: string;
  browseOrder?: NewsOrder;
  favorOrder?: NewsOrder;
  collectOrder?: NewsOrder;
  page: number;
  pageSize: number;
}

export function createNews(news: PartialNews) {
  return axios.post<any>('/news', news);
}

export function updateNews(id: number, news: PartialNews) {
  return axios.put<any>(`/news/${id}`, news);
}
export function deleteNews(id: number) {
  return axios.delete<any>(`/news/${id}`);
}

export function getNewsById(id: string) {
  return axios.get(`/news/${id}`);
}

export function listNewsPage(params: NewsParam) {
  console.log(params);
  return axios.get('/news', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface NewsCatgory {
  id: string;
  name: string;
}
export function listNewsCategory() {
  return axios.get<NewsCatgory[]>(`/news/category/`);
}
