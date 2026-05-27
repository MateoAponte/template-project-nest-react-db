import type { StateCreator } from 'zustand';
import type { IAuthSlice, ISessionPayload } from './interfaces';
import { sessionStorageService } from '../../common/infra/storage/session';

export const createAuthSlice: StateCreator<IAuthSlice> = (set) => ({
  user: null,
  session: null,
  accessToken: null,
  isAuthenticated: false,

  setSession: (payload: ISessionPayload) => {
    sessionStorageService.set(payload);

    set({
      accessToken: payload.at_secret,
      isAuthenticated: true,
      user: payload.user,
    });
  },

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  clearSession: () => {
    sessionStorageService.clear();

    set({
      session: null,
      isAuthenticated: false,
    });
  },

  hydrateSession: () => {
    const session = sessionStorageService.get();

    set({
      session,
      isAuthenticated: Boolean(session?.at_secret),
    });
  },
});
