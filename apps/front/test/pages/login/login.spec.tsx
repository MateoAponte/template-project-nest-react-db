import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from '../../../src/auth/views/Login';
import { apiClient } from '../../../src/common/infra/http/client';

vi.mock('../../../src/common/infra/http/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockedApiClient = vi.mocked(apiClient);

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit login request and reset form on success', async () => {
    const user = userEvent.setup();

    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        data: {
          at_secret: 'at_secret',
          rt_secret: 'rt_secret',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'test@example.com',
            rol: 1,
            activities: [0],
          },
        },
      }
    });

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '1234567891011');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'MTIzNDU2Nzg5MTAxMQ==',
      });
    });
  });

  it('should show validation errors when form is empty', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockedApiClient.post).not.toHaveBeenCalled();

    expect(await screen.findByText(/Enter a valid email address/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i),
    ).toBeInTheDocument();
  });
  
  it('should show password incompatible pattern error', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345678');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockedApiClient.post).not.toHaveBeenCalled();

    expect(
      await screen.findByText(/Password must be at least 12 characters/i),
    ).toBeInTheDocument();
  });

  it('should show submit error when api login fails', async () => {
    const user = userEvent.setup();

    mockedApiClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '1234567891011');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/Invalid credentials/i),
    ).toBeInTheDocument();
  });
});