/**
 * Tests for SettingsMenu component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SettingsMenu from '../SettingsMenu';
import { useSettingsStore } from '@/lib/settingsStore';
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

// Mock window.confirm
global.confirm = jest.fn(() => true);

describe('SettingsMenu', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    localStorageMock.clear();
    useSettingsStore.getState().resetSettings();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockPush.mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('should render settings title', () => {
    render(<SettingsMenu />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render all setting sections', () => {
    render(<SettingsMenu />);
    expect(screen.getByText('Text Speed')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Gameplay')).toBeInTheDocument();
  });

  describe('Text Speed', () => {
    it('should display current text speed', () => {
      render(<SettingsMenu />);
      const select = screen.getByLabelText('Text Speed') as HTMLSelectElement;
      expect(select.value).toBe('medium');
    });

    it('should update text speed on change', () => {
      render(<SettingsMenu />);
      const select = screen.getByLabelText('Text Speed') as HTMLSelectElement;

      fireEvent.change(select, { target: { value: 'fast' } });
      expect(useSettingsStore.getState().textSpeed).toBe('fast');
    });

    it('should have all text speed options', () => {
      render(<SettingsMenu />);
      const select = screen.getByLabelText('Text Speed') as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toEqual(['slow', 'medium', 'fast', 'instant']);
    });
  });

  describe('Music Toggle', () => {
    it('should display music toggle', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Music')).toBeInTheDocument();
      expect(screen.getByText('Background music (placeholder)')).toBeInTheDocument();
    });

    it('should toggle music on click', () => {
      render(<SettingsMenu />);
      const toggle = screen.getByRole('switch', { name: 'Toggle music' });

      expect(useSettingsStore.getState().musicEnabled).toBe(true);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().musicEnabled).toBe(false);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().musicEnabled).toBe(true);
    });

    it('should show correct toggle state visually', () => {
      render(<SettingsMenu />);
      const toggle = screen.getByRole('switch', { name: 'Toggle music' });

      expect(toggle).toHaveClass('bg-blue-600');

      fireEvent.click(toggle);
      expect(toggle).toHaveClass('bg-gray-600');
    });
  });

  describe('Sound Effects Toggle', () => {
    it('should display sound toggle', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Sound Effects')).toBeInTheDocument();
      expect(screen.getByText('UI and ambient sounds (placeholder)')).toBeInTheDocument();
    });

    it('should toggle sound on click', () => {
      render(<SettingsMenu />);
      const toggle = screen.getByRole('switch', { name: 'Toggle sound effects' });

      expect(useSettingsStore.getState().soundEnabled).toBe(true);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().soundEnabled).toBe(false);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().soundEnabled).toBe(true);
    });
  });

  describe('Auto-Save Toggle', () => {
    it('should display auto-save toggle', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Auto-Save')).toBeInTheDocument();
      expect(screen.getByText('Automatically save on scene transitions')).toBeInTheDocument();
    });

    it('should toggle auto-save on click', () => {
      render(<SettingsMenu />);
      const toggle = screen.getByRole('switch', { name: 'Toggle auto-save' });

      expect(useSettingsStore.getState().autoSaveEnabled).toBe(true);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().autoSaveEnabled).toBe(false);

      fireEvent.click(toggle);
      expect(useSettingsStore.getState().autoSaveEnabled).toBe(true);
    });
  });

  describe('Reset Button', () => {
    it('should display reset button', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Reset to Defaults')).toBeInTheDocument();
    });

    it('should show confirmation on reset', () => {
      render(<SettingsMenu />);
      const resetButton = screen.getByText('Reset to Defaults');

      fireEvent.click(resetButton);
      expect(global.confirm).toHaveBeenCalledWith('Reset all settings to defaults?');
    });

    it('should reset settings when confirmed', () => {
      (global.confirm as jest.Mock).mockReturnValueOnce(true);

      const store = useSettingsStore.getState();
      store.setTextSpeed('instant');
      store.setMusicEnabled(false);

      render(<SettingsMenu />);
      const resetButton = screen.getByText('Reset to Defaults');

      fireEvent.click(resetButton);

      expect(useSettingsStore.getState().textSpeed).toBe('medium');
      expect(useSettingsStore.getState().musicEnabled).toBe(true);
    });

    it('should not reset settings when cancelled', () => {
      (global.confirm as jest.Mock).mockReturnValueOnce(false);

      const store = useSettingsStore.getState();
      store.setTextSpeed('instant');

      render(<SettingsMenu />);
      const resetButton = screen.getByText('Reset to Defaults');

      fireEvent.click(resetButton);

      expect(useSettingsStore.getState().textSpeed).toBe('instant');
    });
  });

  describe('Close Button', () => {
    it('should show close button by default', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('should call onClose when clicked', () => {
      const onClose = jest.fn();
      render(<SettingsMenu onClose={onClose} />);

      fireEvent.click(screen.getByText('Close'));
      expect(onClose).toHaveBeenCalled();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(<SettingsMenu showCloseButton={false} />);
      expect(screen.queryByText('Close')).not.toBeInTheDocument();
    });
  });

  describe('Return to Menu Button', () => {
    it('should hide return button by default', () => {
      render(<SettingsMenu />);
      expect(screen.queryByText('Return to Menu')).not.toBeInTheDocument();
    });

    it('should show return button when showReturnToMenu is true', () => {
      render(<SettingsMenu showReturnToMenu={true} />);
      expect(screen.getByText('Return to Menu')).toBeInTheDocument();
    });

    it('should navigate to menu when clicked', () => {
      render(<SettingsMenu showReturnToMenu={true} />);

      fireEvent.click(screen.getByText('Return to Menu'));
      expect(mockPush).toHaveBeenCalledWith('/menu');
    });
  });

  describe('Info Note', () => {
    it('should display placeholder note', () => {
      render(<SettingsMenu />);
      expect(screen.getByText(/Audio features are placeholders/)).toBeInTheDocument();
    });
  });

  describe('Auto-Save Indicator', () => {
    it('should display auto-save message', () => {
      render(<SettingsMenu />);
      expect(screen.getByText('Settings are saved automatically')).toBeInTheDocument();
    });
  });

  describe('Settings Persistence', () => {
    it('should persist settings across renders', () => {
      const { unmount } = render(<SettingsMenu />);
      const select = screen.getByLabelText('Text Speed') as HTMLSelectElement;

      fireEvent.change(select, { target: { value: 'fast' } });
      unmount();

      // Re-render
      render(<SettingsMenu />);
      const newSelect = screen.getByLabelText('Text Speed') as HTMLSelectElement;
      expect(newSelect.value).toBe('fast');
    });

    it('should save to localStorage on toggle', () => {
      render(<SettingsMenu />);
      const toggle = screen.getByRole('switch', { name: 'Toggle music' });

      fireEvent.click(toggle);

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed.musicEnabled).toBe(false);
    });
  });
});
