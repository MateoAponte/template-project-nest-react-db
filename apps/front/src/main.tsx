import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { setupInterceptors } from './common/infra/http/interceptor.ts';
import { AppRouter } from './router/router.tsx';

import './common/styles/index.scss';
import './common/styles/vendors/tailwind.css';
import { useAppStore } from './common/store/store.ts';

setupInterceptors();

function App() {
  const hydrateSession = useAppStore((state) => state.hydrateSession);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  return <AppRouter />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
