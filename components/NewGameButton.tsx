/**
 * New Game Button Component
 * Button that starts a new game with optional confirmation if progress exists
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import ConfirmDialog from './ConfirmDialog';

interface NewGameButtonProps {
  /** Button text */
  children?: React.ReactNode;
  /** Button className for styling */
  className?: string;
  /** Callback after new game starts */
  onNewGame?: () => void;
  /** Whether to delete auto-save when starting new game */
  deleteAutoSave?: boolean;
  /** Whether to show confirmation even without progress */
  alwaysConfirm?: boolean;
}

export default function NewGameButton({
  children = 'New Game',
  className = '',
  onNewGame,
  deleteAutoSave = true,
  alwaysConfirm = false,
}: NewGameButtonProps) {
  const { startNewGame, hasProgress } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    // Check if player has progress
    if (hasProgress() || alwaysConfirm) {
      setShowConfirm(true);
    } else {
      handleStartNewGame();
    }
  };

  const handleStartNewGame = () => {
    startNewGame(deleteAutoSave);
    setShowConfirm(false);
    onNewGame?.();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Start New Game?"
        message="Starting a new game will reset all progress. This action cannot be undone. Are you sure you want to continue?"
        confirmText="Start New Game"
        cancelText="Cancel"
        confirmType="danger"
        onConfirm={handleStartNewGame}
        onCancel={handleCancel}
      />
    </>
  );
}
