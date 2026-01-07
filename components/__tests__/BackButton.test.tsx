/**
 * Tests for BackButton component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../BackButton';
import { useGameStore } from '@/lib/store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('BackButton', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  it('should render back button', () => {
    render(<BackButton />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    const { container } = render(<BackButton />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render icon-only variant', () => {
    render(<BackButton variant="icon" />);
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('should be disabled when no history exists', () => {
    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be enabled when history exists', () => {
    const store = useGameStore.getState();
    store.goToScene('scene-1');

    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should call goBack when clicked', () => {
    const store = useGameStore.getState();
    store.goToScene('scene-1');
    store.goToScene('scene-2');

    render(<BackButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    // Should have gone back to scene-1
    expect(useGameStore.getState().currentScene).toBe('scene-1');
  });

  it('should not call goBack when disabled', () => {
    const store = useGameStore.getState();
    const initialScene = store.currentScene;

    render(<BackButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    // Scene should not have changed
    expect(useGameStore.getState().currentScene).toBe(initialScene);
  });

  it('should call onBack callback when going back', () => {
    const onBack = jest.fn();
    const store = useGameStore.getState();
    store.goToScene('scene-1');

    render(<BackButton onBack={onBack} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onBack).toHaveBeenCalled();
  });

  it('should not call onBack when disabled', () => {
    const onBack = jest.fn();

    render(<BackButton onBack={onBack} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onBack).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<BackButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should show helpful title on hover', () => {
    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'No previous scenes');
  });

  it('should show different title when enabled', () => {
    const store = useGameStore.getState();
    store.goToScene('scene-1');

    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Go back to previous scene');
  });

  it('should handle multiple back operations', () => {
    const store = useGameStore.getState();
    store.goToScene('scene-1');
    store.goToScene('scene-2');
    store.goToScene('scene-3');

    const { rerender } = render(<BackButton />);

    // Go back to scene-2
    fireEvent.click(screen.getByRole('button'));
    expect(useGameStore.getState().currentScene).toBe('scene-2');

    // Re-render to update button state
    rerender(<BackButton />);

    // Go back to scene-1
    fireEvent.click(screen.getByRole('button'));
    expect(useGameStore.getState().currentScene).toBe('scene-1');

    // Re-render to update button state
    rerender(<BackButton />);

    // Go back to X-0-001
    fireEvent.click(screen.getByRole('button'));
    expect(useGameStore.getState().currentScene).toBe('X-0-001');

    // Re-render to update button state
    rerender(<BackButton />);

    // Should now be disabled
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show disabled styles when no history', () => {
    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:bg-gray-800');
  });
});
