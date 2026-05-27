import type { IUser } from '../store/interfaces';

interface AccessOptions {
  rol?: number;
  permissions?: number[];
  requireAll?: boolean;
}

export const canAccess = (user: IUser | null, options: AccessOptions): boolean => {
  if (!user) return false;

  const { rol, permissions = [], requireAll = false } = options;

  
  const hasRoles = rol === undefined ? true : user.rol === rol;

  const hasPermissions =
    permissions.length === 0
      ? true
      : requireAll
        ? permissions.every((permission) => user.activities?.includes(permission))
        : permissions.some((permission) => user.activities?.includes(permission));

  return hasRoles && hasPermissions;
};
