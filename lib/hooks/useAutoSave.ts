/**
 * Auto-save hook
 * Automatically saves game state on scene transitions
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import { useSettingsStore } from '../settingsStore';
import { autoSave } from '../saveGame';

interface UseAutoSaveOptions {
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Delay before auto-saving after scene change (ms) (default: 500) */
  delay?: number;
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const { enabled = true, delay = 500 } = options;

  const [isSaving, setIsSaving] = useState(false);
  const currentScene = useGameStore((state) => state.currentScene);
  const autoSaveEnabled = useSettingsStore((state) => state.autoSaveEnabled);
  const previousScene = useRef<string>(currentScene);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Only auto-save if enabled (both hook option and settings) and scene has actually changed
    if (!enabled || !autoSaveEnabled || currentScene === previousScene.current) {
      return;
    }

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set saving state immediately
    setIsSaving(true);

    // Delay the actual save slightly to batch rapid scene changes
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const gameState = useGameStore.getState();
        autoSave({
          currentScene: gameState.currentScene,
          sceneHistory: gameState.sceneHistory,
          currentPath: gameState.currentPath,
          dayTime: gameState.dayTime,
          workAssignment: gameState.workAssignment,
          inventory: gameState.inventory,
          relationships: gameState.relationships,
          discoveredCharacters: gameState.discoveredCharacters,
          flags: gameState.flags,
          evidence: gameState.evidence,
          stats: gameState.stats,
        });

        // Mark saving as complete
        setIsSaving(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setIsSaving(false);
      }
    }, delay);

    // Update previous scene
    previousScene.current = currentScene;

    // Cleanup timeout on unmount or scene change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentScene, enabled, autoSaveEnabled, delay]);

  return { isSaving };
}
