import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';

vi.mock('../../app/components/sections/Hero', () => ({
  __esModule: true,
  default: ({ onTriggerRain }: { onTriggerRain: () => void }) => (
    <div data-testid="hero-mock">
      <button
        data-testid="hero-trigger"
        onClick={onTriggerRain}
      >
        Trigger Rain
      </button>
    </div>
  ),
}));

vi.mock('../../app/components/sections/CountdownTimer', () => ({
  __esModule: true,
  default: () => <div data-testid="countdown-mock" />
}));

vi.mock('../../app/components/sections/EmailSignup', () => ({
  __esModule: true,
  default: () => <div data-testid="email-mock" />
}));

vi.mock('../../app/components/sections/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer-mock" />
}));

vi.mock('../../app/components/RainOverlay', () => ({
  __esModule: true,
  default: (props: any) => {
    if (!props.active) return null;
    
    return (
      <div
        data-testid="rain-overlay"
        data-active={String(props.active)}
        data-density={String(props.density)}
        data-speed={String(props.speed)}
        data-dropwidth={String(props.dropWidth)}
        data-maxdroplength={String(props.maxDropLength)}
        data-showletters={String(props.showLetters)}
      />
    );
  },
}));

import Home from '../../app/page';

describe('Home component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main sections and does NOT render RainOverlay initially', () => {
    render(<Home />);

    expect(screen.getByTestId('hero-mock')).toBeInTheDocument();
    expect(screen.getByTestId('countdown-mock')).toBeInTheDocument();
    expect(screen.getByTestId('email-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('rain-overlay')).toBeNull();
  });

  it('renders RainOverlay with the expected props when the hero trigger is clicked', () => {
    render(<Home />);

    expect(screen.queryByTestId('rain-overlay')).toBeNull();
    
    act(() => {
      const triggerButton = screen.getByTestId('hero-trigger');
      fireEvent.click(triggerButton);
    });

    const overlay = screen.getByTestId('rain-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('data-active', 'true');
    expect(overlay).toHaveAttribute('data-density', '4');
    expect(overlay).toHaveAttribute('data-speed', '2');
    expect(overlay).toHaveAttribute('data-dropwidth', '1.7');
    expect(overlay).toHaveAttribute('data-maxdroplength', '25');
    expect(overlay).toHaveAttribute('data-showletters', 'true');
  });
});