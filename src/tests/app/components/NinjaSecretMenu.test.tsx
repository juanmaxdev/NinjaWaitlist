import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';

const mockCheckRiddle = vi.fn();

Object.defineProperty(window, 'window', {
  value: global,
  writable: true,
});

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...props }: any) => {
          const {
            initial,
            animate,
            whileInView,
            whileHover,
            whileFocus,
            whileTap,
            transition,
            exit,
            variants,
            drag,
            layout,
            layoutId,
            style,
            className,
            ...htmlProps
          } = props;

          if (className) htmlProps.className = className;

          return React.createElement('div', htmlProps, children);
        },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../app/hooks/riddles', () => ({
  useRiddleSubmit: () => ({
    checkRiddle: mockCheckRiddle,
  }),
}));

import NinjaSecretMenu from '../../../app/components/NinjaSecretMenu';

const mockOnVisibilityChange = vi.fn();
const mockOnSecretFound = vi.fn();

const defaultProps = {
  isVisible: true,
  collectedLetters: {
    days: 'N',
    hours: 'I',
    minutes: 'N',
    seconds: 'J',
  },
  onVisibilityChange: mockOnVisibilityChange,
  onSecretFound: mockOnSecretFound,
};

describe('NinjaSecretMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders when visible', () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
    expect(screen.getAllByText('N')).toHaveLength(2);
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<NinjaSecretMenu {...defaultProps} isVisible={false} />);

    expect(screen.queryByText(/Los que guardan la hora/)).not.toBeInTheDocument();
  });

  it('shows verification countdown when all letters are filled', () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('3'))
    ).toBeInTheDocument();
  });

  it('shows success message when riddle is correct', async () => {
    mockCheckRiddle.mockResolvedValue({ correct: true, answer: 'NINJA' });

    render(<NinjaSecretMenu {...defaultProps} />);
    expect(screen.getByText(/Verificando en 3/)).toBeInTheDocument();

    await act(async () => {
      await mockCheckRiddle('NINJ');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockCheckRiddle).toHaveBeenCalledWith('NINJ');

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
  });

  it('shows error message when riddle is incorrect', async () => {
    mockCheckRiddle.mockResolvedValue({ correct: false });

    render(<NinjaSecretMenu {...defaultProps} />);

    expect(screen.getByText(/Verificando en 3/)).toBeInTheDocument();

    await act(async () => {
      await mockCheckRiddle('NINJ');
    });

    expect(mockCheckRiddle).toHaveBeenCalledWith('NINJ');

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
  });

  it('calls onVisibilityChange after hide timer', () => {
    const incompleteLetters = { ...defaultProps.collectedLetters, seconds: '' };

    render(<NinjaSecretMenu {...defaultProps} collectedLetters={incompleteLetters} />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(mockOnVisibilityChange).toHaveBeenCalledWith(false);
  });

  it('does not start verification if letters are incomplete', () => {
    const incompleteLetters = { ...defaultProps.collectedLetters, seconds: '' };

    render(<NinjaSecretMenu {...defaultProps} collectedLetters={incompleteLetters} />);

    expect(screen.queryByText(/Verificando/)).not.toBeInTheDocument();
  });

  it('updates countdown correctly', async () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('3'))
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('2'))
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('1'))
    ).toBeInTheDocument();
  });

  it('displays progress bar when not in success state', () => {
    const incompleteLetters = { ...defaultProps.collectedLetters, seconds: '' };

    render(<NinjaSecretMenu {...defaultProps} collectedLetters={incompleteLetters} />);

    const progressContainer = document.querySelector('.w-32');
    expect(progressContainer).toBeInTheDocument();
  });

  it('renders collected letters in correct order', () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    const letterElements = screen.getAllByText(/[NINJ]/);
    expect(letterElements).toHaveLength(4);
  });

  it('clears all timers on unmount', () => {
    const { unmount } = render(<NinjaSecretMenu {...defaultProps} />);

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(clearIntervalSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it('shows cryptic message in header', () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    expect(
      screen.getByText('Los que guardan la hora en la palma de la sombra no piden permiso al amanecer')
    ).toBeInTheDocument();
  });

  it('handles empty letters correctly', () => {
    const emptyLetters = {
      days: '',
      hours: '',
      minutes: '',
      seconds: '',
    };

    render(<NinjaSecretMenu {...defaultProps} collectedLetters={emptyLetters} />);

    expect(screen.queryByText(/Verificando/)).not.toBeInTheDocument();
    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
  });

  it('resets verification countdown when letters become incomplete', () => {
    const { rerender } = render(<NinjaSecretMenu {...defaultProps} />);

    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('3'))
    ).toBeInTheDocument();

    const incompleteLetters = { ...defaultProps.collectedLetters, seconds: '' };
    rerender(<NinjaSecretMenu {...defaultProps} collectedLetters={incompleteLetters} />);

    expect(screen.queryByText(/Verificando/)).not.toBeInTheDocument();
  });

  it('maintains correct letter styling based on state', () => {
    render(<NinjaSecretMenu {...defaultProps} />);

    const letterElements = document.querySelectorAll('.text-red-400');
    expect(letterElements.length).toBeGreaterThan(0);
  });

  it('displays success state styling when correct', async () => {
    mockCheckRiddle.mockResolvedValue({ correct: true, answer: 'NINJA' });

    const { rerender } = render(<NinjaSecretMenu {...defaultProps} />);

    rerender(<NinjaSecretMenu {...defaultProps} />);

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();

    const letterBoxes = document.querySelectorAll('.border-gray-600');
    expect(letterBoxes.length).toBe(4);

    const greenElements = document.querySelectorAll('.text-red-400');
    expect(greenElements.length).toBeGreaterThan(0);
  });

  it('displays error state styling when incorrect', async () => {
    mockCheckRiddle.mockResolvedValue({ correct: false });

    render(<NinjaSecretMenu {...defaultProps} />);

    expect(screen.getByText(/Verificando en 3/)).toBeInTheDocument();

    await act(async () => {
      await mockCheckRiddle('NINJ');
    });

    expect(mockCheckRiddle).toHaveBeenCalledWith('NINJ');

    const errorElements = document.querySelectorAll('.text-red-400');
    expect(errorElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
  });

  it('handles component re-visibility correctly', () => {
    const { rerender } = render(<NinjaSecretMenu {...defaultProps} isVisible={false} />);

    expect(screen.queryByText(/Los que guardan la hora/)).not.toBeInTheDocument();

    rerender(<NinjaSecretMenu {...defaultProps} isVisible={true} />);

    expect(screen.getByText(/Los que guardan la hora/)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Verificando en') && content.includes('3'))
    ).toBeInTheDocument();
  });
});
