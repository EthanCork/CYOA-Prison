/**
 * Settings Menu Component
 * Comprehensive settings interface with persistence
 */

'use client';

import { useRouter } from 'next/navigation';
import { useSettingsStore, TextSpeed } from '@/lib/settingsStore';

interface SettingsMenuProps {
  /** Callback when closing settings */
  onClose?: () => void;
  /** Show close button */
  showCloseButton?: boolean;
  /** Show return to menu button */
  showReturnToMenu?: boolean;
}

export default function SettingsMenu({
  onClose,
  showCloseButton = true,
  showReturnToMenu = false,
}: SettingsMenuProps) {
  const router = useRouter();
  const {
    textSpeed,
    musicEnabled,
    soundEnabled,
    autoSaveEnabled,
    setTextSpeed,
    setMusicEnabled,
    setSoundEnabled,
    setAutoSaveEnabled,
    resetSettings,
  } = useSettingsStore();

  const handleTextSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSpeed(e.target.value as TextSpeed);
  };

  const handleReturnToMenu = () => {
    router.push('/menu');
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      resetSettings();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full shadow-xl border border-gray-700">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Text Speed */}
        <div>
          <label
            htmlFor="text-speed"
            className="block text-lg font-semibold text-gray-200 mb-3"
          >
            Text Speed
          </label>
          <select
            id="text-speed"
            value={textSpeed}
            onChange={handleTextSpeedChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
            <option value="instant">Instant</option>
          </select>
          <p className="mt-2 text-sm text-gray-400">
            Controls how quickly text appears during scenes
          </p>
        </div>

        {/* Audio Settings */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Audio</h3>

          {/* Music Toggle */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-700/50 rounded-lg">
            <div>
              <label
                htmlFor="music"
                className="text-lg font-medium text-gray-200 cursor-pointer"
              >
                Music
              </label>
              <p className="text-sm text-gray-400 mt-1">
                Background music (placeholder)
              </p>
            </div>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                musicEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={musicEnabled}
              aria-label="Toggle music"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  musicEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div>
              <label
                htmlFor="sound"
                className="text-lg font-medium text-gray-200 cursor-pointer"
              >
                Sound Effects
              </label>
              <p className="text-sm text-gray-400 mt-1">
                UI and ambient sounds (placeholder)
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={soundEnabled}
              aria-label="Toggle sound effects"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Gameplay</h3>

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div>
              <label
                htmlFor="autosave"
                className="text-lg font-medium text-gray-200 cursor-pointer"
              >
                Auto-Save
              </label>
              <p className="text-sm text-gray-400 mt-1">
                Automatically save on scene transitions
              </p>
            </div>
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={autoSaveEnabled}
              aria-label="Toggle auto-save"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  autoSaveEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> Audio features are placeholders. Sound and music
            will be implemented in future updates.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3 justify-between">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors border border-gray-600"
        >
          Reset to Defaults
        </button>

        <div className="flex gap-3">
          {showReturnToMenu && (
            <button
              onClick={handleReturnToMenu}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Return to Menu
            </button>
          )}

          {showCloseButton && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Settings saved indicator */}
      <p className="mt-4 text-center text-sm text-gray-400">
        Settings are saved automatically
      </p>
    </div>
  );
}
