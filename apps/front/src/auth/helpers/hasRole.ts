import type { IUser } from '../store/interfaces';

export const hasRole = (user: IUser | null, role: number): boolean => {
  if (!user) return false;
  return user.rol === role;
};

export const hasAnyRole = (user: IUser | null, rol: number): boolean => {
  if (!user) return false;
  return rol === user.rol;
};
