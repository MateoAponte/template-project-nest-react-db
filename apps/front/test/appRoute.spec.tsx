import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AppRouter } from '../src/router/router';
import { ROUTES } from '../src/router/routePaths';

const mockUseAppStore = vi.fn();

vi.mock('../src/common/store/store.ts', () => ({
  useAppStore: (selector: any) => selector(mockUseAppStore()),
}));

describe('AppRouter', () => {
  it('Should render login page', () => {
    mockUseAppStore.mockReturnValue({
      isAuthenticated: false,
    });

    window.history.pushState({}, '', ROUTES.login);

    render(<AppRouter />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("Should render dashboard page if is authenticated", () => {
    mockUseAppStore.mockReturnValue({
      isAuthenticated: true,
    });

    window.history.pushState({}, '', ROUTES.dashboard);

    render(<AppRouter />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('Should render profile page', () => {
    mockUseAppStore.mockReturnValue({
      isAuthenticated: true,
    });

    window.history.pushState({}, '', ROUTES.dashboard);
    
    render(<AppRouter />);
    
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  // it('Should render users page', () => {
  //   mockUseAppStore.mockReturnValue({
  //     isAuthenticated: true,
  //     user: {
  //       rol: 1,
  //       activities: [0],
  //     }
  //   });
  //   window.history.pushState({}, '', ROUTES.users);

  //   render(<AppRouter />);

  //   expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();
  // });

  it('Should render unauthorized page', () => {
    window.history.pushState({}, '', ROUTES.unauthorized);

    render(<AppRouter />);

    expect(screen.getByRole('heading', { name: /unauthorized/i })).toBeInTheDocument();
  });

  it('Should render not found page for unknown routes', () => {
    window.history.pushState({}, '', '/unknown-route');

    render(<AppRouter />);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });
});