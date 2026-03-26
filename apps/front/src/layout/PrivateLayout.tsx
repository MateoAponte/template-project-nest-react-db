import { Link, Outlet } from 'react-router-dom';
import { useAppStore } from '../common/store/store';
import { ROUTES } from '../router/routePaths';

export const PrivateLayout = () => {
  const user = useAppStore((state) => state.user);

  return (
    <div
      style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '240px 1fr' }}
    >
      <aside style={{ padding: '1rem', borderRight: '1px solid #e5e7eb' }}>
        <h2>My App</h2>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link to={ROUTES.dashboard}>Dashboard</Link>
            </li>
            <li>
              <Link to={ROUTES.profile}>Profile</Link>
            </li>
            <li>
              <Link to={ROUTES.users}>Users</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div>
        <header
          style={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Welcome{user?.name ? `, ${user.name}` : ''}</span>
        </header>

        <main style={{ padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
