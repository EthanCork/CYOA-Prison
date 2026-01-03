/**
 * Custom hook for managing scene transitions with state management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store';
import { loadScene, sceneExists } from '../sceneLoader';
import { checkChoiceRequirements, collectStateChanges } from '../sceneTransitions';
import type { Scene, Choice } from '@/types';
import type { StateChange } from '@/components/StateChangeNotification';

export function useSceneTransition() {
  const {
    currentScene: currentSceneId,
    sceneHistory,
    transitionToScene,
    goBack,
    canGoBack,
    inventory,
    flags,
    relationships,
    evidence,
    resetGame,
  } = useGameStore();

  const [scene, setScene] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentStateChanges, setRecentStateChanges] = useState<StateChange[]>([]);

  // Load scene when currentSceneId changes and apply auto-actions
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      if (sceneExists(currentSceneId)) {
        const loadedScene = loadScene(currentSceneId);
        setScene(loadedScene);

        // Collect state changes from scene entry
        const stateChanges = collectStateChanges(loadedScene);
        const changes: StateChange[] = [];

        // Track flag changes
        if (stateChanges.flags?.set) {
          stateChanges.flags.set.forEach((flag) => {
            changes.push({ type: 'flag', action: 'set', name: flag });
          });
        }
        if (stateChanges.flags?.unset) {
          stateChanges.flags.unset.forEach((flag) => {
            changes.push({ type: 'flag', action: 'unset', name: flag });
          });
        }

        // Track item changes
        if (stateChanges.items?.add) {
          stateChanges.items.add.forEach((item) => {
            changes.push({ type: 'item', action: 'add', name: item });
          });
        }
        if (stateChanges.items?.remove) {
          stateChanges.items.remove.forEach((item) => {
            changes.push({ type: 'item', action: 'remove', name: item });
          });
        }

        // Track relationship changes
        if (stateChanges.relationships) {
          Object.entries(stateChanges.relationships).forEach(([character, value]) => {
            changes.push({
              type: 'relationship',
              action: value > 0 ? 'increase' : 'decrease',
              name: character,
              value,
            });
          });
        }

        // Track evidence changes
        if (stateChanges.evidence?.add) {
          stateChanges.evidence.add.forEach((item) => {
            changes.push({ type: 'evidence', action: 'add', name: item });
          });
        }
        if (stateChanges.evidence?.remove) {
          stateChanges.evidence.remove.forEach((item) => {
            changes.push({ type: 'evidence', action: 'remove', name: item });
          });
        }

        setRecentStateChanges(changes);
      } else {
        setError(`Scene not found: ${currentSceneId}`);
        setScene(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scene');
      setScene(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentSceneId]);

  // Handle choice selection with state transitions
  const handleChoiceSelected = useCallback(
    (choice: Choice) => {
      if (!scene) return;

      // Check if choice requirements are met
      const { canSelect, reason } = checkChoiceRequirements(choice, {
        inventory,
        flags,
        relationships,
        evidence,
      });

      if (!canSelect) {
        console.warn(`Choice blocked: ${reason}`);
        return;
      }

      // Transition to next scene with state changes
      transitionToScene(choice.nextScene, scene, choice);
    },
    [scene, inventory, flags, relationships, evidence, transitionToScene]
  );

  // Handle auto-continue for narrative scenes
  const handleContinue = useCallback(
    (nextSceneId: string) => {
      if (!scene) return;

      // Transition to next scene with scene-level state changes (no choice)
      transitionToScene(nextSceneId, scene);
    },
    [scene, transitionToScene]
  );

  // Check if a specific choice is available
  const isChoiceAvailable = useCallback(
    (choice: Choice) => {
      const { canSelect } = checkChoiceRequirements(choice, {
        inventory,
        flags,
        relationships,
        evidence,
      });
      return canSelect;
    },
    [inventory, flags, relationships, evidence]
  );

  // Get lock reason for a choice
  const getChoiceLockReason = useCallback(
    (choice: Choice) => {
      const { reason } = checkChoiceRequirements(choice, {
        inventory,
        flags,
        relationships,
        evidence,
      });
      return reason;
    },
    [inventory, flags, relationships, evidence]
  );

  // Clear recent state changes (for notification dismissal)
  const clearStateChanges = useCallback(() => {
    setRecentStateChanges([]);
  }, []);

  return {
    // Current scene data
    scene,
    currentSceneId,
    isLoading,
    error,

    // Navigation
    handleChoiceSelected,
    handleContinue,
    goBack,
    canGoBack: canGoBack(),
    sceneHistory,

    // Choice validation
    isChoiceAvailable,
    getChoiceLockReason,

    // Game state
    inventory,
    flags,
    relationships,
    evidence,

    // Utilities
    resetGame,

    // State change notifications
    recentStateChanges,
    clearStateChanges,
  };
}
