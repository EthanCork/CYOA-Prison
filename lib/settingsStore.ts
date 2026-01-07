/**
 * Settings Store
 * Manages game settings with localStorage persistence
 */

import { create } from 'zustand';

export type TextSpeed = 'slow' | 'medium' | 'fast' | 'instant';

export interface GameSettings {
  textSpeed: TextSpeed;
  musicEnabled: boolean;
  soundEnabled: boolean;
  autoSaveEnabled: boolean;
}

interface SettingsStore extends GameSettings {
  // Actions
  setTextSpeed: (speed: TextSpeed) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const STORAGE_KEY = 'el-palo-de-queso-settings';

/**
 * Default settings
 */
export const defaultSettings: GameSettings = {
  textSpeed: 'medium',
  musicEnabled: true,
  soundEnabled: true,
  autoSaveEnabled: true,
};

/**
 * Load settings from localStorage
 */
function loadSettingsFromStorage(): GameSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }

    const parsed = JSON.parse(stored);

    // Validate and merge with defaults
    return {
      textSpeed: ['slow', 'medium', 'fast', 'instant'].includes(parsed.textSpeed)
        ? parsed.textSpeed
        : defaultSettings.textSpeed,
      musicEnabled: typeof parsed.musicEnabled === 'boolean'
        ? parsed.musicEnabled
        : defaultSettings.musicEnabled,
      soundEnabled: typeof parsed.soundEnabled === 'boolean'
        ? parsed.soundEnabled
        : defaultSettings.soundEnabled,
      autoSaveEnabled: typeof parsed.autoSaveEnabled === 'boolean'
        ? parsed.autoSaveEnabled
        : defaultSettings.autoSaveEnabled,
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
}

/**
 * Save settings to localStorage
 */
function saveSettingsToStorage(settings: GameSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Settings store
 */
export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // Initialize with defaults (will be overridden by loadSettings)
  ...defaultSettings,

  setTextSpeed: (speed: TextSpeed) => {
    set({ textSpeed: speed });
    const state = get();
    saveSettingsToStorage({
      textSpeed: state.textSpeed,
      musicEnabled: state.musicEnabled,
      soundEnabled: state.soundEnabled,
      autoSaveEnabled: state.autoSaveEnabled,
    });
  },

  setMusicEnabled: (enabled: boolean) => {
    set({ musicEnabled: enabled });
    const state = get();
    saveSettingsToStorage({
      textSpeed: state.textSpeed,
      musicEnabled: state.musicEnabled,
      soundEnabled: state.soundEnabled,
      autoSaveEnabled: state.autoSaveEnabled,
    });
  },

  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
    const state = get();
    saveSettingsToStorage({
      textSpeed: state.textSpeed,
      musicEnabled: state.musicEnabled,
      soundEnabled: state.soundEnabled,
      autoSaveEnabled: state.autoSaveEnabled,
    });
  },

  setAutoSaveEnabled: (enabled: boolean) => {
    set({ autoSaveEnabled: enabled });
    const state = get();
    saveSettingsToStorage({
      textSpeed: state.textSpeed,
      musicEnabled: state.musicEnabled,
      soundEnabled: state.soundEnabled,
      autoSaveEnabled: state.autoSaveEnabled,
    });
  },

  resetSettings: () => {
    set(defaultSettings);
    saveSettingsToStorage(defaultSettings);
  },

  loadSettings: () => {
    const loaded = loadSettingsFromStorage();
    set(loaded);
  },

  saveSettings: () => {
    const state = get();
    saveSettingsToStorage({
      textSpeed: state.textSpeed,
      musicEnabled: state.musicEnabled,
      soundEnabled: state.soundEnabled,
      autoSaveEnabled: state.autoSaveEnabled,
    });
  },
}));

/**
 * Initialize settings on app start
 */
if (typeof window !== 'undefined') {
  useSettingsStore.getState().loadSettings();
}
