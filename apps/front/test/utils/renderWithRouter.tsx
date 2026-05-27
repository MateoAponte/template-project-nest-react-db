import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

type RenderWithRouterOptions = {
  initialRoute?: string;
};

export const renderWithRouter = (
  ui: ReactNode,
  { initialRoute = '/' }: RenderWithRouterOptions = {},
) => {
  return render(<MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>);
};
