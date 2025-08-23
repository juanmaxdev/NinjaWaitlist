import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';
import CountdownTimer from '../../../../app/components/sections/CountdownTimer';

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
            onClick,
            className,
            ...htmlProps
          } = props;
          
          if (onClick) htmlProps.onClick = onClick;
          if (className) htmlProps.className = className;
          
          return React.createElement('div', htmlProps, children);
        },
    }
  ),
}));

vi.mock('lucide-react', () => ({
  BadgeJapaneseYen: ({ className }: { className?: string }) => (
    <div className={className} data-testid="badge-japanese-yen">Badge</div>
  ),
}));

vi.mock('../../../../app/lib/japaneseAlphabetMapper', () => ({
  mapTimeUnit: vi.fn((unit: string, value: number) => {
    const mapping: { [key: string]: string } = {
      'days': 'N',
      'hours': 'I', 
      'minutes': 'N',
      'seconds': 'J'
    };
    return mapping[unit] || 'X';
  }),
}));

const mockNinjaSecretMenu = vi.fn();
vi.mock('../../../../app/components/NinjaSecretMenu', () => ({
  default: (props: any) => {
    mockNinjaSecretMenu(props);
    const { isVisible, collectedLetters, onVisibilityChange, onSecretFound } = props;
    
    if (!isVisible) return null;
    
    return (
      <div data-testid="ninja-secret-menu">
        <div>Ninja Secret Menu Active</div>
        <div data-testid="collected-letters">
          {Object.values(collectedLetters).filter(Boolean).join('')}
        </div>
        <button 
          onClick={() => onVisibilityChange(false)}
          data-testid="close-menu"
        >
          Close Menu
        </button>
        <button 
          onClick={() => onSecretFound('NINJA')}
          data-testid="secret-found"
        >
          Secret Found
        </button>
      </div>
    );
  },
}));

const mockOnSecretWordFound = vi.fn();

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    const mockDate = new Date('2025-01-01T00:00:00');
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders countdown timer with correct structure', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);
    
    expect(screen.getByText('TIEMPO RESTANTE')).toBeInTheDocument();
    expect(screen.getAllByTestId('badge-japanese-yen')).toHaveLength(2);
    expect(screen.getByText('DÍAS')).toBeInTheDocument();
    expect(screen.getByText('HORAS')).toBeInTheDocument();
    expect(screen.getByText('MIN')).toBeInTheDocument();
    expect(screen.getByText('SEG')).toBeInTheDocument();
    expect(screen.getByText(/La cuenta atrás ha comenzado... prepárate para lo inevitable/)).toBeInTheDocument();
  });

  it('calculates and displays time correctly', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);
    
    expect(screen.getByText('DÍAS')).toBeInTheDocument();
    expect(screen.getByText('HORAS')).toBeInTheDocument();
    expect(screen.getByText('MIN')).toBeInTheDocument();
    expect(screen.getByText('SEG')).toBeInTheDocument();
  });


  it('handles time unit click and collects letters', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    
    expect(daysContainer).toBeInTheDocument();
    
    fireEvent.click(daysContainer!);
    
    expect(mockNinjaSecretMenu).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        collectedLetters: expect.objectContaining({
          days: 'N'
        })
      })
    );
  });

  it('shows NinjaSecretMenu when time unit is clicked', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    expect(screen.queryByTestId('ninja-secret-menu')).not.toBeInTheDocument();

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    expect(screen.getByTestId('ninja-secret-menu')).toBeInTheDocument();
    expect(screen.getByText('Ninja Secret Menu Active')).toBeInTheDocument();
  });

  it('collects letters when clicking different time units', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    const hoursElement = screen.getByText('HORAS');
    const hoursContainer = hoursElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(hoursContainer!);

    const collectedLettersElement = screen.getByTestId('collected-letters');
    expect(collectedLettersElement.textContent).toContain('N');
    expect(collectedLettersElement.textContent).toContain('I');
  });

  it('handles menu visibility changes correctly', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    expect(screen.getByTestId('ninja-secret-menu')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-menu');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('ninja-secret-menu')).not.toBeInTheDocument();
  });

  it('calls onSecretWordFound when secret is found', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    const secretButton = screen.getByTestId('secret-found');
    fireEvent.click(secretButton);

    expect(mockOnSecretWordFound).toHaveBeenCalledWith('NINJA');
  });

  it('updates countdown timer every second', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    expect(screen.getByText('DÍAS')).toBeInTheDocument();

    vi.advanceTimersByTime(1000);

    expect(screen.getByText('DÍAS')).toBeInTheDocument();
    expect(screen.getByText('HORAS')).toBeInTheDocument();
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('displays motivational message', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);
    
    expect(screen.getByText(/La cuenta atrás ha comenzado... prepárate para lo inevitable/)).toBeInTheDocument();
  });

  it('handles multiple time unit clicks', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    const hoursElement = screen.getByText('HORAS');
    const hoursContainer = hoursElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(hoursContainer!);

    expect(screen.getByTestId('ninja-secret-menu')).toBeInTheDocument();
    
    const collectedLetters = screen.getByTestId('collected-letters');
    expect(collectedLetters.textContent).toMatch(/[NI]/);
  });

  it('resets collected letters when menu closes', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    expect(screen.getByTestId('ninja-secret-menu')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-menu');
    fireEvent.click(closeButton);

    fireEvent.click(daysContainer!);

    expect(mockNinjaSecretMenu).toHaveBeenCalledWith(
      expect.objectContaining({
        collectedLetters: expect.objectContaining({
          days: '',
          hours: '',
          minutes: '',
          seconds: ''
        })
      })
    );
  });

  it('passes correct props to NinjaSecretMenu', () => {
    render(<CountdownTimer onSecretWordFound={mockOnSecretWordFound} />);

    const daysElement = screen.getByText('DÍAS');
    const daysContainer = daysElement.closest('[class*="cursor-pointer"]');
    fireEvent.click(daysContainer!);

    expect(mockNinjaSecretMenu).toHaveBeenCalledWith({
      isVisible: true,
      collectedLetters: {
        days: 'N',
        hours: '',
        minutes: '',
        seconds: ''
      },
      onVisibilityChange: expect.any(Function),
      onSecretFound: expect.any(Function)
    });
  });
});