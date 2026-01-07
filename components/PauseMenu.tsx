/**
 * Pause Menu Component
 * In-game pause menu with save/load/settings options
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SaveLoadMenu from './SaveLoadMenu';
import SettingsMenu from './SettingsMenu';
import ConfirmDialog from './ConfirmDialog';

interface PauseMenuProps {
  /** Callback when resume is clicked */
  onResume: () => void;
  /** Whether pause menu is open */
  isOpen: boolean;
}

export default function PauseMenu({ onResume, isOpen }: PauseMenuProps) {
  const router = useRouter();
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMainMenuConfirm, setShowMainMenuConfirm] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    setShowSaveLoad(true);
  };

  const handleLoad = () => {
    setShowSaveLoad(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleMainMenu = () => {
    setShowMainMenuConfirm(true);
  };

  const handleConfirmMainMenu = () => {
    router.push('/menu');
  };

  const handleCancelMainMenu = () => {
    setShowMainMenuConfirm(false);
  };

  // If sub-menu is open, show that instead
  if (showSaveLoad) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
        <div className="max-w-2xl w-full mx-4">
          <SaveLoadMenu
            onClose={() => setShowSaveLoad(false)}
            showCloseButton={true}
          />
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
        <SettingsMenu onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Paused</h2>
            <p className="text-gray-400 text-sm">Press ESC to resume</p>
          </div>

          {/* Menu Options */}
          <div className="space-y-3">
            <button
              onClick={onResume}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-green-900/50 border border-green-600/30"
            >
              Resume Game
            </button>

            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-blue-900/50 border border-blue-700/30"
            >
              Save Game
            </button>

            <button
              onClick={handleLoad}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-purple-900/50 border border-purple-700/30"
            >
              Load Game
            </button>

            <button
              onClick={handleSettings}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-gray-900/50 border border-gray-600/30"
            >
              Settings
            </button>

            <button
              onClick={handleMainMenu}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-red-900/50 border border-red-700/30"
            >
              Main Menu
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Keyboard Shortcuts: <span className="text-gray-400">ESC</span> - Resume
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showMainMenuConfirm}
        title="Return to Main Menu?"
        message="Any unsaved progress will be lost. Make sure to save your game before returning to the main menu."
        confirmText="Return to Menu"
        cancelText="Stay in Game"
        confirmType="warning"
        onConfirm={handleConfirmMainMenu}
        onCancel={handleCancelMainMenu}
      />
    </>
  );
}
