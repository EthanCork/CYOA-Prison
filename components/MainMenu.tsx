/**
 * Main Menu Component
 * Title screen and main menu for El Palo de Queso
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import NewGameButton from './NewGameButton';
import SaveLoadMenu from './SaveLoadMenu';
import SettingsMenu from './SettingsMenu';

interface MainMenuProps {
  /** Callback when game starts */
  onStartGame?: () => void;
  /** Show settings button */
  showSettingsButton?: boolean;
}

export default function MainMenu({
  onStartGame,
  showSettingsButton = true,
}: MainMenuProps) {
  const router = useRouter();
  const { hasProgress, hasAutoSaveData, loadFromAutoSave } = useGameStore();
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewGame = () => {
    onStartGame?.();
    router.push('/game-full-demo');
  };

  const handleContinue = () => {
    // Try to load auto-save, if it exists
    const loaded = loadFromAutoSave();
    if (loaded) {
      onStartGame?.();
      router.push('/game-full-demo');
    }
  };

  const handleLoadGame = () => {
    setShowLoadMenu(true);
  };

  const handleLoadComplete = () => {
    setShowLoadMenu(false);
    onStartGame?.();
    router.push('/game-full-demo');
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const canContinue = hasAutoSaveData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 bg-[url('/prison-bars-pattern.svg')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Vignette effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />

      <div className="relative z-10 max-w-2xl w-full px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 tracking-wider text-shadow-lg">
            <span className="bg-gradient-to-b from-amber-200 to-amber-600 bg-clip-text text-transparent">
              Île de Pierre
            </span>
          </h1>
          <p className="text-lg text-gray-400 tracking-wide font-light italic mb-2">
            Stone Island
          </p>
          <p className="text-xl text-gray-400 tracking-wide font-light">
            A Prison Escape in 58 Endings
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Brittany Coast, France • 1923
          </p>
        </div>

        {/* Menu Options */}
        <div className="space-y-4 max-w-md mx-auto">
          <NewGameButton
            onNewGame={handleNewGame}
            className="w-full px-8 py-4 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-red-900/50 border border-red-600/30"
          >
            New Game
          </NewGameButton>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg border ${
              canContinue
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white hover:shadow-blue-900/50 border-blue-600/30'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700/30'
            }`}
          >
            Continue
            {canContinue && (
              <span className="ml-2 text-sm font-normal text-blue-300">
                (Auto-Save)
              </span>
            )}
          </button>

          <button
            onClick={handleLoadGame}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-purple-900/50 border border-purple-600/30"
          >
            Load Game
          </button>

          {showSettingsButton && (
            <button
              onClick={handleSettings}
              className="w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-gray-900/50 border border-gray-600/30"
            >
              Settings
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Use headphones for the best experience</p>
        </div>
      </div>

      {/* Load Game Menu Modal */}
      {showLoadMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <SaveLoadMenu
              onClose={() => setShowLoadMenu(false)}
              showCloseButton={true}
            />
            {/* Add a custom load handler */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowLoadMenu(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <SettingsMenu onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
}
