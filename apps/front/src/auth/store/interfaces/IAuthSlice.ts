import type { AuthTokens } from '../../../common/infra/storage/session';
import type { ISessionPayload } from './ISessionPayload';
import type { IUser } from './IUser';

export interface IAuthSlice {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  session: AuthTokens | null;

  setSession: (payload: ISessionPayload) => void;
  logout: () => void;
  clearSession: () => void;
  hydrateSession: () => void;
}
