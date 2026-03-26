import type { InternalAxiosRequestConfig } from 'axios';

export interface IRetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
