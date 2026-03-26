import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../routePaths';
import { useAppStore } from '../../common/store/store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
};
