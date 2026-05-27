import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from '../../../src/layout/NotFound';


describe('NotFoundPage', () => {
  it('should render the 404 title', () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole('heading', { name: '404' }),
    ).toBeInTheDocument();
  });

  it('should render the page not found message', () => {
    render(<NotFoundPage />);

    expect(
      screen.getByText(/page not found/i),
    ).toBeInTheDocument();
  });
});