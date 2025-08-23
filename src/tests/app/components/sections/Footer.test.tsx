import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../../../../app/components/sections/Footer';

vi.mock('framer-motion', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Footer component', () => {
  it('should render the main title', () => {
    render(<Footer />);
    expect(screen.getByText('Iniciativa Ninja')).toBeInTheDocument();
  });

  it('should render the separator line', () => {
    render(<Footer />);
    expect(screen.getByTestId('separator-line')).toBeInTheDocument();
  });

  it('should render the paragraph text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Algo se oculta aquí. Sé precavido, sigue tu instinto ninja y descubre lo que pocos ven./)
    ).toBeInTheDocument();
  });
});
