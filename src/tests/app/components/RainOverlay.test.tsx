import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RainOverlay from '../../../app/components/RainOverlay';

describe('RainOverlay Component', () => {
  let originalRAF: typeof requestAnimationFrame;
  let originalCancelRAF: typeof cancelAnimationFrame;
  let originalResizeObserver: typeof ResizeObserver;
  let originalDateNow: typeof Date.now;
  let originalGetContext: any;

  beforeEach(() => {
    cleanup();

    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Array(4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      canvas: {},
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      lineWidth: 1,
      strokeStyle: '',
      fillStyle: '',
    }) as any;

    originalRAF = window.requestAnimationFrame;
    originalCancelRAF = window.cancelAnimationFrame;
    originalResizeObserver = window.ResizeObserver;
    originalDateNow = Date.now;

    vi.useFakeTimers();

    let rafId = 0;
    window.requestAnimationFrame = vi.fn((cb) => {
      rafId += 1;
      setTimeout(() => cb(rafId), 0);
      return rafId;
    });
    window.cancelAnimationFrame = vi.fn();

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCancelRAF;
    window.ResizeObserver = originalResizeObserver;
    Date.now = originalDateNow;
    vi.useRealTimers();
  });

  it('renders canvas with correct testid and styles', () => {
    render(<RainOverlay />);
    const canvas = screen.getByTestId('rain-overlay');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle({ width: '100%', height: '100%' });
  });

  it('renders without crashing when active with drops', () => {
    render(<RainOverlay active />);
    const canvas = screen.getByTestId('rain-overlay');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with letters and calls onFinish after letterDuration', () => {
    const onFinishMock = vi.fn();
    render(<RainOverlay active showLetters letterDuration={1} onFinish={onFinishMock} />);

    vi.advanceTimersByTime(1000);

    expect(onFinishMock).toHaveBeenCalled();
  });

  it('accepts custom props without crashing', () => {
    render(
      <RainOverlay
        active
        density={0.8}
        speed={2}
        dropWidth={2}
        maxDropLength={30}
        zIndex={10}
        showLetters
        targetWord="test"
        decoyLetters={['x', 'y', 'z']}
        letterColor="#fff"
        letterSize={20}
        letterDuration={5}
      />
    );
    const canvas = screen.getByTestId('rain-overlay');
    expect(canvas).toBeInTheDocument();
  });

  it('cleans up requestAnimationFrame and ResizeObserver on unmount', () => {
    const { unmount } = render(<RainOverlay active />);

    vi.advanceTimersByTime(100);

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    const observerInstance = (window.ResizeObserver as any).mock.results[0].value;
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });
});
