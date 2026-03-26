import { apiClient } from '../../common/infra/http/client';
import type { IResponse } from '../../common/infra/http/interfaces/IResponse';
import type { ISessionPayload } from '../store/interfaces';
import type { ILoginRequest } from './interfaces/ILoginRequest';

export const authService = {
  async login(payload: ILoginRequest): Promise<ISessionPayload> {
    const { data } = await apiClient.post<IResponse<ISessionPayload>>(
      '/auth/login',
      payload,
    );
    return data.data;
  },

  async me(): Promise<ISessionPayload['at_secret']> {
    const { data } =
      await apiClient.get<IResponse<ISessionPayload['at_secret']>>('/auth/me');
    return data.data;
  },

  async refresh(): Promise<ISessionPayload> {
    const { data } = await apiClient.post<IResponse<ISessionPayload>>('/auth/refresh');
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
