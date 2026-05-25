import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { useAppStore } from '../../store/store';
import { authService } from '../../../auth/service/auth.service';
import type { IRetryableRequestConfig } from './interfaces/IRetryRequest';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const onRequest = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAppStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

const onRequestError = (error: AxiosError) => Promise.reject(error);

const onResponse = <T>(response: T) => response;

const onResponseError = async (error: AxiosError) => {
  const originalRequest = error.config as IRetryableRequestConfig | undefined;
  const status = error.response?.status;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const isRefreshCall = originalRequest.url?.includes('/auth/refresh');

  if (status === 401 && !originalRequest._retry && !isRefreshCall) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await authService.refresh();
      const { setSession } = useAppStore.getState();

      setSession({
        at_secret: response.at_secret,
        rt_secret: response.rt_secret,
        user: response.user,
      });

      processQueue(null, response.at_secret);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${response.at_secret}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      const { logout } = useAppStore.getState();
      logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

export const setupInterceptors = () => {
  apiClient.interceptors.request.use(onRequest, onRequestError);
  apiClient.interceptors.response.use(onResponse, onResponseError);
};
