import _axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { auth } from '@/commons/auth';

const axios = (baseURL?: string): AxiosInstance => {
  const instance = _axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
    timeout: 1000,
  });

  // 添加 request 攔截器
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const jwToken = auth?.getToken();
      if (jwToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${jwToken}`,
        };
      }
      return config;
    },
    (error) => {
      // 對請求錯誤進行處理
      return Promise.reject(error);
    }
  );

  return instance;
};

export { axios };

export default axios();
