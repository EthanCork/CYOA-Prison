/**
 * Save/Load Menu Component
 * Provides UI for saving, loading, and deleting game saves across 3 slots
 */

'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import {
  getAllSaveSlots,
  type SaveSlot,
  MAX_SAVE_SLOTS,
} from '@/lib/saveGame';

interface SaveLoadMenuProps {
  /** Callback when menu should be closed */
  onClose?: () => void;
  /** Whether to show the close button */
  showCloseButton?: boolean;
}

export default function SaveLoadMenu({
  onClose,
  showCloseButton = true,
}: SaveLoadMenuProps) {
  const { saveToSlot, loadFromSlot, deleteSlot } = useGameStore();
  const [saveSlots, setSaveSlots] = useState<(SaveSlot | null)[]>([]);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'save' | 'load' | 'delete';
    slotNumber: number;
  } | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Load save slot metadata
  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    const slots = getAllSaveSlots();
    setSaveSlots(slots);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = (slotNumber: number) => {
    const slot = saveSlots[slotNumber - 1];

    // If slot has existing save, confirm overwrite
    if (slot) {
      setConfirmAction({ type: 'save', slotNumber });
    } else {
      performSave(slotNumber);
    }
  };

  const performSave = (slotNumber: number) => {
    try {
      const savedGame = saveToSlot(slotNumber);
      refreshSlots();
      showNotification(
        `Game saved to Slot ${slotNumber} at ${savedGame.metadata.dateString}`,
        'success'
      );
      setConfirmAction(null);
    } catch (error) {
      showNotification(
        `Failed to save game: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
      setConfirmAction(null);
    }
  };

  const handleLoad = (slotNumber: number) => {
    const slot = saveSlots[slotNumber - 1];

    if (!slot) {
      showNotification(`Slot ${slotNumber} is empty`, 'error');
      return;
    }

    // Confirm load to prevent accidental loss of progress
    setConfirmAction({ type: 'load', slotNumber });
  };

  const performLoad = (slotNumber: number) => {
    try {
      const success = loadFromSlot(slotNumber);
      if (success) {
        showNotification(`Game loaded from Slot ${slotNumber}`, 'success');
        setConfirmAction(null);
        // Close menu after successful load
        if (onClose) {
          setTimeout(onClose, 1000);
        }
      } else {
        showNotification(`Failed to load: Slot ${slotNumber} is empty`, 'error');
        setConfirmAction(null);
      }
    } catch (error) {
      showNotification(
        `Failed to load game: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
      setConfirmAction(null);
    }
  };

  const handleDelete = (slotNumber: number) => {
    const slot = saveSlots[slotNumber - 1];

    if (!slot) {
      showNotification(`Slot ${slotNumber} is already empty`, 'error');
      return;
    }

    setConfirmAction({ type: 'delete', slotNumber });
  };

  const performDelete = (slotNumber: number) => {
    try {
      deleteSlot(slotNumber);
      refreshSlots();
      showNotification(`Slot ${slotNumber} deleted`, 'success');
      setConfirmAction(null);
    } catch (error) {
      showNotification(
        `Failed to delete save: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
      setConfirmAction(null);
    }
  };

  const cancelConfirm = () => {
    setConfirmAction(null);
  };

  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Save/Load Game</h2>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded ${
            notification.type === 'success'
              ? 'bg-green-900 text-green-200'
              : 'bg-red-900 text-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Save Slots */}
      <div className="space-y-4">
        {Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => {
          const slotNumber = index + 1;
          const slot = saveSlots[index];

          return (
            <div
              key={slotNumber}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex justify-between items-start">
                {/* Slot Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Slot {slotNumber}
                  </h3>

                  {slot ? (
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="font-medium text-gray-100">
                        {slot.dateString}
                      </div>
                      <div>Scene: {slot.currentScene}</div>
                      {slot.currentPath && (
                        <div>
                          Path:{' '}
                          {slot.currentPath === 'A'
                            ? 'Night/Stealth'
                            : slot.currentPath === 'B'
                            ? 'Social/Persuasion'
                            : 'Day/Justice'}
                        </div>
                      )}
                      {slot.dayTime && (
                        <div>
                          Day {slot.dayTime.day} - {slot.dayTime.timeOfDay}
                        </div>
                      )}
                      <div>Play Time: {formatPlayTime(slot.playTimeSeconds)}</div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">Empty Slot</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(slotNumber)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleLoad(slotNumber)}
                    disabled={!slot}
                    className={`px-4 py-2 rounded transition-colors ${
                      slot
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(slotNumber)}
                    disabled={!slot}
                    className={`px-4 py-2 rounded transition-colors ${
                      slot
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}
            </h3>

            <p className="text-gray-300 mb-6">
              {confirmAction.type === 'save' &&
                `This will overwrite the existing save in Slot ${confirmAction.slotNumber}. Continue?`}
              {confirmAction.type === 'load' &&
                `This will load the save from Slot ${confirmAction.slotNumber}. Any unsaved progress will be lost. Continue?`}
              {confirmAction.type === 'delete' &&
                `This will permanently delete the save in Slot ${confirmAction.slotNumber}. This cannot be undone. Continue?`}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelConfirm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'save') {
                    performSave(confirmAction.slotNumber);
                  } else if (confirmAction.type === 'load') {
                    performLoad(confirmAction.slotNumber);
                  } else if (confirmAction.type === 'delete') {
                    performDelete(confirmAction.slotNumber);
                  }
                }}
                className={`px-4 py-2 rounded transition-colors ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {confirmAction.type === 'save' && 'Overwrite'}
                {confirmAction.type === 'load' && 'Load'}
                {confirmAction.type === 'delete' && 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
