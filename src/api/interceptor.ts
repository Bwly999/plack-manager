import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  errno: number;
  errmsg: string;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
// axios.defaults.baseURL = 'http://139.196.12.152:8080';
// axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.baseURL = 'http://47.99.200.3:8081';
// axios.defaults.baseURL = 'http://www.bwly999.top:8080';

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `${token}`;
    }
    // config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>): any => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.errno !== 0) {
      Message.error({
        content: res.errmsg || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.errno) &&
        response.config.url !== '/api/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.errmsg || 'Error'));
    }
    return res;
  },
  (error) => {
    const res = error.response.data;
    Message.error({
      content: res.errmsg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
