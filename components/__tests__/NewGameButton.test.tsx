/**
 * Tests for NewGameButton component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewGameButton from '../NewGameButton';
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

describe('NewGameButton', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  it('should render with default text', () => {
    render(<NewGameButton />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('should render with custom children', () => {
    render(<NewGameButton>Start Fresh</NewGameButton>);
    expect(screen.getByText('Start Fresh')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<NewGameButton className="custom-class">New Game</NewGameButton>);
    const button = screen.getByText('New Game');
    expect(button).toHaveClass('custom-class');
  });

  it('should start new game immediately when no progress exists', () => {
    const onNewGame = jest.fn();
    render(<NewGameButton onNewGame={onNewGame} />);

    const store = useGameStore.getState();
    expect(store.hasProgress()).toBe(false);

    fireEvent.click(screen.getByText('New Game'));

    // Should not show confirmation dialog
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument();

    // Should call onNewGame callback
    expect(onNewGame).toHaveBeenCalled();

    // Should reset to initial scene
    expect(useGameStore.getState().currentScene).toBe('X-0-001');
  });

  it('should show confirmation dialog when progress exists', () => {
    render(<NewGameButton />);

    // Create some progress
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    expect(store.hasProgress()).toBe(true);

    fireEvent.click(screen.getByText('New Game'));

    // Should show confirmation dialog
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();
    expect(screen.getByText(/Starting a new game will reset all progress/)).toBeInTheDocument();
  });

  it('should start new game when confirmed', () => {
    const onNewGame = jest.fn();
    render(<NewGameButton onNewGame={onNewGame} />);

    // Create progress
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.addItem('test-item');

    fireEvent.click(screen.getByText('New Game'));

    // Confirm dialog should appear
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();

    // Click confirm button (in the dialog)
    const confirmButtons = screen.getAllByText('Start New Game');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-red-600')
    );
    fireEvent.click(confirmButton!);

    // Should reset game
    expect(useGameStore.getState().currentScene).toBe('X-0-001');
    expect(useGameStore.getState().inventory).toEqual([]);

    // Should call callback
    expect(onNewGame).toHaveBeenCalled();

    // Dialog should close
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument();
  });

  it('should cancel new game when cancelled', () => {
    const onNewGame = jest.fn();
    render(<NewGameButton onNewGame={onNewGame} />);

    // Create progress
    const store = useGameStore.getState();
    store.goToScene('test-scene');

    fireEvent.click(screen.getByText('New Game'));
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Should not reset game
    expect(useGameStore.getState().currentScene).toBe('test-scene');

    // Should not call callback
    expect(onNewGame).not.toHaveBeenCalled();

    // Dialog should close
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument();
  });

  it('should delete auto-save by default', () => {
    render(<NewGameButton />);

    // Create auto-save
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.performAutoSave();
    expect(store.hasAutoSaveData()).toBe(true);

    fireEvent.click(screen.getByText('New Game'));

    const confirmButtons = screen.getAllByText('Start New Game');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-red-600')
    );
    fireEvent.click(confirmButton!);

    // Auto-save should be deleted
    expect(useGameStore.getState().hasAutoSaveData()).toBe(false);
  });

  it('should keep auto-save when deleteAutoSave is false', () => {
    render(<NewGameButton deleteAutoSave={false} />);

    // Create auto-save
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.performAutoSave();
    expect(store.hasAutoSaveData()).toBe(true);

    fireEvent.click(screen.getByText('New Game'));

    const confirmButtons = screen.getAllByText('Start New Game');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-red-600')
    );
    fireEvent.click(confirmButton!);

    // Auto-save should still exist
    expect(useGameStore.getState().hasAutoSaveData()).toBe(true);
  });

  it('should always show confirmation when alwaysConfirm is true', () => {
    render(<NewGameButton alwaysConfirm={true} />);

    const store = useGameStore.getState();
    expect(store.hasProgress()).toBe(false);

    fireEvent.click(screen.getByText('New Game'));

    // Should show confirmation even without progress
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();
  });

  it('should handle multiple clicks correctly', () => {
    render(<NewGameButton />);

    // Create progress
    const store = useGameStore.getState();
    store.goToScene('test-scene');

    // First click - open dialog
    fireEvent.click(screen.getByText('New Game'));
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();

    // Cancel
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument();

    // Second click - open dialog again
    fireEvent.click(screen.getByText('New Game'));
    expect(screen.getByText('Start New Game?')).toBeInTheDocument();

    // Confirm this time
    const confirmButtons = screen.getAllByText('Start New Game');
    const confirmButton = confirmButtons.find(btn =>
      btn.className.includes('bg-red-600')
    );
    fireEvent.click(confirmButton!);

    expect(useGameStore.getState().currentScene).toBe('X-0-001');
  });
});
