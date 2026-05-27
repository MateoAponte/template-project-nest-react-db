import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UnauthorizedPage } from '../../../src/layout/Unauthorized';


describe('UnauthorizedPage', () => {
  it('should render the unauthorized title', () => {
    render(<UnauthorizedPage />);

    expect(
      screen.getByRole('heading', { name: /unauthorized/i }),
    ).toBeInTheDocument();
  });

  it('should render the access denied message', () => {
    render(<UnauthorizedPage />);

    expect(
      screen.getByText(/you do not have access to this page/i),
    ).toBeInTheDocument();
  });
});