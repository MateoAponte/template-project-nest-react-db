import type { IUser } from '../store/interfaces';

export const hasPermission = (user: IUser | null, permission: number): boolean => {
  if (!user?.activities) return false;
  return user.activities.includes(permission);
};

export const hasAnyPermission = (user: IUser | null, permissions: number[]): boolean => {
  if (!user?.activities) return false;
  return permissions.some((permission) => user.activities!.includes(permission));
};
