import { useAppStore } from '../../common/store/store';
import { canAccess } from '../helpers/canAccess';
import { hasPermission } from '../helpers/hasActivities';
import { hasRole } from '../helpers/hasRole';

export const useAuthorization = () => {
  const user = useAppStore((state) => state.user);

  return {
    user,
    hasRole: (role: number) => hasRole(user, role),
    hasPermission: (permission: number) => hasPermission(user, permission),
    canAccess: (options: {
      roles?: number[];
      permissions?: number[];
      requireAll?: boolean;
    }) => canAccess(user, options),
  };
};
