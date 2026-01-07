/**
 * Tests for settings store
 */

import { useSettingsStore, defaultSettings, TextSpeed } from '../settingsStore';

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

describe('Settings Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useSettingsStore.getState().resetSettings();
  });

  describe('Default Settings', () => {
    it('should initialize with default settings', () => {
      const store = useSettingsStore.getState();
      expect(store.textSpeed).toBe('medium');
      expect(store.musicEnabled).toBe(true);
      expect(store.soundEnabled).toBe(true);
      expect(store.autoSaveEnabled).toBe(true);
    });
  });

  describe('Text Speed', () => {
    it('should update text speed', () => {
      const store = useSettingsStore.getState();
      store.setTextSpeed('fast');
      expect(useSettingsStore.getState().textSpeed).toBe('fast');
    });

    it('should persist text speed to localStorage', () => {
      const store = useSettingsStore.getState();
      store.setTextSpeed('instant');

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.textSpeed).toBe('instant');
    });

    it('should support all text speed values', () => {
      const store = useSettingsStore.getState();
      const speeds: TextSpeed[] = ['slow', 'medium', 'fast', 'instant'];

      speeds.forEach(speed => {
        store.setTextSpeed(speed);
        expect(useSettingsStore.getState().textSpeed).toBe(speed);
      });
    });
  });

  describe('Music Toggle', () => {
    it('should toggle music enabled', () => {
      const store = useSettingsStore.getState();
      expect(store.musicEnabled).toBe(true);

      store.setMusicEnabled(false);
      expect(useSettingsStore.getState().musicEnabled).toBe(false);

      store.setMusicEnabled(true);
      expect(useSettingsStore.getState().musicEnabled).toBe(true);
    });

    it('should persist music setting', () => {
      const store = useSettingsStore.getState();
      store.setMusicEnabled(false);

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed.musicEnabled).toBe(false);
    });
  });

  describe('Sound Toggle', () => {
    it('should toggle sound enabled', () => {
      const store = useSettingsStore.getState();
      expect(store.soundEnabled).toBe(true);

      store.setSoundEnabled(false);
      expect(useSettingsStore.getState().soundEnabled).toBe(false);

      store.setSoundEnabled(true);
      expect(useSettingsStore.getState().soundEnabled).toBe(true);
    });

    it('should persist sound setting', () => {
      const store = useSettingsStore.getState();
      store.setSoundEnabled(false);

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed.soundEnabled).toBe(false);
    });
  });

  describe('Auto-Save Toggle', () => {
    it('should toggle auto-save enabled', () => {
      const store = useSettingsStore.getState();
      expect(store.autoSaveEnabled).toBe(true);

      store.setAutoSaveEnabled(false);
      expect(useSettingsStore.getState().autoSaveEnabled).toBe(false);

      store.setAutoSaveEnabled(true);
      expect(useSettingsStore.getState().autoSaveEnabled).toBe(true);
    });

    it('should persist auto-save setting', () => {
      const store = useSettingsStore.getState();
      store.setAutoSaveEnabled(false);

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed.autoSaveEnabled).toBe(false);
    });
  });

  describe('Reset Settings', () => {
    it('should reset all settings to defaults', () => {
      const store = useSettingsStore.getState();

      // Change all settings
      store.setTextSpeed('instant');
      store.setMusicEnabled(false);
      store.setSoundEnabled(false);
      store.setAutoSaveEnabled(false);

      // Reset
      store.resetSettings();

      const state = useSettingsStore.getState();
      expect(state.textSpeed).toBe(defaultSettings.textSpeed);
      expect(state.musicEnabled).toBe(defaultSettings.musicEnabled);
      expect(state.soundEnabled).toBe(defaultSettings.soundEnabled);
      expect(state.autoSaveEnabled).toBe(defaultSettings.autoSaveEnabled);
    });

    it('should persist reset to localStorage', () => {
      const store = useSettingsStore.getState();
      store.setTextSpeed('instant');
      store.resetSettings();

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed).toEqual(defaultSettings);
    });
  });

  describe('Load Settings', () => {
    it('should load settings from localStorage', () => {
      // Save settings manually
      const customSettings = {
        textSpeed: 'fast' as TextSpeed,
        musicEnabled: false,
        soundEnabled: false,
        autoSaveEnabled: false,
      };
      localStorage.setItem('el-palo-de-queso-settings', JSON.stringify(customSettings));

      // Load settings
      const store = useSettingsStore.getState();
      store.loadSettings();

      const state = useSettingsStore.getState();
      expect(state.textSpeed).toBe('fast');
      expect(state.musicEnabled).toBe(false);
      expect(state.soundEnabled).toBe(false);
      expect(state.autoSaveEnabled).toBe(false);
    });

    it('should use defaults if localStorage is empty', () => {
      const store = useSettingsStore.getState();
      store.loadSettings();

      const state = useSettingsStore.getState();
      expect(state).toMatchObject(defaultSettings);
    });

    it('should validate and fix invalid text speed', () => {
      // Save invalid settings
      const invalidSettings = {
        textSpeed: 'invalid-speed',
        musicEnabled: true,
        soundEnabled: true,
        autoSaveEnabled: true,
      };
      localStorage.setItem('el-palo-de-queso-settings', JSON.stringify(invalidSettings));

      const store = useSettingsStore.getState();
      store.loadSettings();

      // Should fall back to default
      expect(useSettingsStore.getState().textSpeed).toBe(defaultSettings.textSpeed);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('el-palo-de-queso-settings', 'invalid-json{');

      const store = useSettingsStore.getState();
      store.loadSettings();

      // Should fall back to defaults
      const state = useSettingsStore.getState();
      expect(state).toMatchObject(defaultSettings);
    });
  });

  describe('Save Settings', () => {
    it('should save current settings to localStorage', () => {
      const store = useSettingsStore.getState();
      store.setTextSpeed('slow');
      store.setMusicEnabled(false);

      // Manually call saveSettings
      store.saveSettings();

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed.textSpeed).toBe('slow');
      expect(parsed.musicEnabled).toBe(false);
    });
  });

  describe('Multiple Settings Changes', () => {
    it('should handle multiple rapid changes', () => {
      const store = useSettingsStore.getState();

      store.setTextSpeed('slow');
      store.setTextSpeed('fast');
      store.setTextSpeed('instant');

      expect(useSettingsStore.getState().textSpeed).toBe('instant');
    });

    it('should persist latest state after multiple changes', () => {
      const store = useSettingsStore.getState();

      store.setTextSpeed('slow');
      store.setMusicEnabled(false);
      store.setSoundEnabled(false);
      store.setAutoSaveEnabled(false);

      const saved = localStorage.getItem('el-palo-de-queso-settings');
      const parsed = JSON.parse(saved!);
      expect(parsed).toEqual({
        textSpeed: 'slow',
        musicEnabled: false,
        soundEnabled: false,
        autoSaveEnabled: false,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const store = useSettingsStore.getState();

      // Should not throw
      expect(() => store.setTextSpeed('fast')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      // Restore
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });
});
