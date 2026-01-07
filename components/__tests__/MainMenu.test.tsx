/**
 * Tests for MainMenu component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainMenu from '../MainMenu';
import { useGameStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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

describe('MainMenu', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockPush.mockClear();
  });

  it('should render the game title', () => {
    render(<MainMenu />);
    expect(screen.getByText('EL PALO DE QUESO')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<MainMenu />);
    expect(screen.getByText('A Prison Escape in 58 Endings')).toBeInTheDocument();
  });

  it('should render all menu buttons', () => {
    render(<MainMenu />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Load Game')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should disable Continue button when no auto-save exists', () => {
    render(<MainMenu />);
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).toBeDisabled();
  });

  it('should enable Continue button when auto-save exists', () => {
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.performAutoSave();

    render(<MainMenu />);
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
  });

  it('should show auto-save label on Continue button', () => {
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.performAutoSave();

    render(<MainMenu />);
    expect(screen.getByText('(Auto-Save)')).toBeInTheDocument();
  });

  it('should open Load Game menu when Load Game clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Load Game'));

    // SaveLoadMenu should be visible
    expect(screen.getByText('Save/Load Game')).toBeInTheDocument();
  });

  it('should open Settings modal when Settings clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Settings'));

    // Settings modal should be visible
    const settingsHeaders = screen.getAllByText('Settings');
    expect(settingsHeaders.length).toBeGreaterThan(0);
  });

  it('should close Settings modal when Close clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Settings'));

    // Click Close button (find by text in button)
    const closeButtons = screen.getAllByText('Close');
    const closeButton = closeButtons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(closeButton!);

    // Settings modal should be hidden (only one Settings text now - the button)
    waitFor(() => {
      const settingsTexts = screen.queryAllByText('Settings');
      expect(settingsTexts.length).toBe(1);
    });
  });

  it('should close Load Game menu when Cancel clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Load Game'));

    // Find and click Cancel button
    const cancelButtons = screen.getAllByText('Cancel');
    const cancelButton = cancelButtons.find(btn =>
      btn.className.includes('bg-gray-700')
    );
    fireEvent.click(cancelButton!);

    // Load menu should be hidden
    waitFor(() => {
      expect(screen.queryByText('Save/Load Game')).not.toBeInTheDocument();
    });
  });

  it('should call onStartGame when New Game confirmed', () => {
    const onStartGame = jest.fn();
    render(<MainMenu onStartGame={onStartGame} />);

    fireEvent.click(screen.getByText('New Game'));

    // No confirmation needed if no progress
    expect(onStartGame).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/game');
  });

  it('should call onStartGame when Continue clicked', () => {
    const onStartGame = jest.fn();
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.performAutoSave();

    render(<MainMenu onStartGame={onStartGame} />);
    fireEvent.click(screen.getByText('Continue').closest('button')!);

    expect(onStartGame).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/game');
  });

  it('should load auto-save when Continue clicked', () => {
    const store = useGameStore.getState();
    store.goToScene('test-scene');
    store.addItem('test-item');
    store.performAutoSave();

    store.resetGame();
    expect(store.currentScene).toBe('X-0-001');

    render(<MainMenu />);
    fireEvent.click(screen.getByText('Continue').closest('button')!);

    // State should be restored
    expect(useGameStore.getState().currentScene).toBe('test-scene');
    expect(useGameStore.getState().inventory).toContain('test-item');
  });

  it('should hide Settings button when showSettingsButton is false', () => {
    render(<MainMenu showSettingsButton={false} />);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should render atmospheric elements', () => {
    const { container } = render(<MainMenu />);

    // Check for gradient background
    const mainDiv = container.querySelector('.bg-gradient-to-b');
    expect(mainDiv).toBeInTheDocument();

    // Check for vignette effect
    const vignette = container.querySelector('.shadow-\\[inset_0_0_200px_rgba\\(0\\,0\\,0\\,0\\.8\\)\\]');
    expect(vignette).toBeInTheDocument();
  });

  it('should render footer message', () => {
    render(<MainMenu />);
    expect(screen.getByText('Use headphones for the best experience')).toBeInTheDocument();
  });

  it('should show settings options in modal', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Settings'));

    expect(screen.getByText('Text Speed')).toBeInTheDocument();
    expect(screen.getByText('Auto-Save')).toBeInTheDocument();
    expect(screen.getByText('Sound Effects')).toBeInTheDocument();
  });
});
