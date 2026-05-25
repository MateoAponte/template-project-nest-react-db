import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../routePaths';
import { canAccess } from '../../auth/helpers/canAccess';
import { useAppStore } from '../../common/store/store';

interface AuthorizedRouteProps {
  rol?: number;
  permissions?: number[];
}

export const AuthorizedRoute = ({ rol, permissions }: AuthorizedRouteProps) => {
  const user = useAppStore((state) => state.user);

  const allowed = canAccess(user, { rol, permissions });

  if (!allowed) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return <Outlet />;
};
