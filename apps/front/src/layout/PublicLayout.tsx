import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <main>
      <section>
        <Outlet />
      </section>
    </main>
  );
};
