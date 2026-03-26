const SESSION_KEY = 'auth_session';

export interface AuthTokens {
  at_secret: string;
  rt_secret: string;
}

export const sessionStorageService = {
  get(): AuthTokens | null {
    const raw = sessionStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthTokens;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  set(data: AuthTokens): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  },

  clear(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
