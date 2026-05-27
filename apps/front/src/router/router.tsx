import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routePaths';

import { UnauthorizedPage } from '../layout/Unauthorized';
import { NotFoundPage } from '../layout/NotFound';
import type { ReactNode } from 'react';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoutes';
import { PrivateLayout } from '../layout/PrivateLayout';
import { AuthorizedRoute } from './components/AuthorizedRoute';
import { Login } from '../auth/views/Login';

const DashboardPage = () => <h1>Dashboard</h1>;
const ProfilePage = () => <h1>Profile</h1>;
// const UsersPage = () => <h1>Users</h1>;

const LoginPage = () => <Login />;
export type AppLayout = 'public' | 'private' | 'system';

export interface AppRouteConfig {
  path: string;
  element: ReactNode;
  layout?: AppLayout;
  isPrivate?: boolean;
  rol?: number;
  permissions?: number[];
}

export const appRoutes: AppRouteConfig[] = [
  { path: ROUTES.login, element: <LoginPage />, layout: 'public' },
  {
    path: ROUTES.home,
    element: <Navigate to={ROUTES.dashboard} replace />,
    layout: 'private',
    isPrivate: true,
  },
  {
    path: ROUTES.dashboard,
    element: <DashboardPage />,
    layout: 'private',
    isPrivate: true,
  },
  { path: ROUTES.profile, element: <ProfilePage />, layout: 'private', isPrivate: true },
  // {
  //   path: ROUTES.users,
  //   element: <UsersPage />,
  //   layout: 'private',
  //   isPrivate: true,
  //   permissions: [0],
  // },
  { path: ROUTES.unauthorized, element: <UnauthorizedPage />, layout: 'system' },
  { path: '*', element: <NotFoundPage />, layout: 'system' },
];

export const AppRouter = () => {
  const publicRoutes = appRoutes.filter((route) => route.layout === 'public');
  const privateRoutes = appRoutes.filter((route) => route.layout === 'private');
  const systemRoutes = appRoutes.filter((route) => route.layout === 'system');

  return (
    <BrowserRouter>
      {' '}
      <Routes>
        {' '}
        <Route element={<PublicRoute />}>
          {' '}
          {/* <Route element={<PublicLayout />}> */}{' '}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}{' '}
          {/* </Route> */}{' '}
        </Route>{' '}
        <Route element={<ProtectedRoute />}>
          {' '}
          <Route element={<PrivateLayout />}>
            {' '}
            {privateRoutes.map((route) => {
              const hasAccessRules = !!route.rol || (route.permissions?.length ?? 0) > 0;
              if (hasAccessRules) {
                return (
                  <Route
                    key={route.path}
                    element={
                      <AuthorizedRoute rol={route.rol} permissions={route.permissions} />
                    }
                  >
                    {' '}
                    <Route path={route.path} element={route.element} />{' '}
                  </Route>
                );
              }
              return <Route key={route.path} path={route.path} element={route.element} />;
            })}{' '}
          </Route>{' '}
        </Route>{' '}
        {systemRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}{' '}
      </Routes>{' '}
    </BrowserRouter>
  );
};
