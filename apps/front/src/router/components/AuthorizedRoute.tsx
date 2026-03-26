import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../routePaths';
import { canAccess } from '../../auth/helpers/canAccess';
import { useAppStore } from '../../common/store/store';

interface AuthorizedRouteProps {
  roles?: number[];
  permissions?: number[];
}

export const AuthorizedRoute = ({ roles, permissions }: AuthorizedRouteProps) => {
  const user = useAppStore((state) => state.user);

  const allowed = canAccess(user, { roles, permissions });

  if (!allowed) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return <Outlet />;
};
