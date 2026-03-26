import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../common/store/store';
import { ROUTES } from '../routePaths';

export const PublicRoute = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
};
