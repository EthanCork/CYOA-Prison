/**
 * Scene Transition Logic - Handles moving from one scene to another
 * Manages state updates, history tracking, and scene changes
 */

import type { Scene, Choice } from '@/types';

/**
 * State changes that can occur during a scene transition
 */
export interface TransitionStateChanges {
  flags?: {
    set?: string[];
    unset?: string[];
  };
  items?: {
    add?: string[];
    remove?: string[];
  };
  relationships?: {
    [characterId: string]: number;
  };
  evidence?: {
    add?: string[];
    remove?: string[];
  };
}

/**
 * Apply flag changes to the game state
 */
export function applyFlagChanges(
  currentFlags: string[],
  changes?: { set?: string[]; unset?: string[] }
): string[] {
  if (!changes) return currentFlags;

  let newFlags = [...currentFlags];

  // Remove flags
  if (changes.unset) {
    newFlags = newFlags.filter((flag) => !changes.unset!.includes(flag));
  }

  // Add new flags (avoiding duplicates)
  if (changes.set) {
    changes.set.forEach((flag) => {
      if (!newFlags.includes(flag)) {
        newFlags.push(flag);
      }
    });
  }

  return newFlags;
}

/**
 * Apply item changes to the inventory
 */
export function applyItemChanges(
  currentInventory: string[],
  changes?: { add?: string[]; remove?: string[] }
): string[] {
  if (!changes) return currentInventory;

  let newInventory = [...currentInventory];

  // Remove items
  if (changes.remove) {
    newInventory = newInventory.filter((item) => !changes.remove!.includes(item));
  }

  // Add new items (avoiding duplicates)
  if (changes.add) {
    changes.add.forEach((item) => {
      if (!newInventory.includes(item)) {
        newInventory.push(item);
      }
    });
  }

  return newInventory;
}

/**
 * Apply relationship changes
 */
export function applyRelationshipChanges(
  currentRelationships: { [characterId: string]: number },
  changes?: { [characterId: string]: number }
): { [characterId: string]: number } {
  if (!changes) return currentRelationships;

  const newRelationships = { ...currentRelationships };

  Object.entries(changes).forEach(([characterId, delta]) => {
    const currentScore = newRelationships[characterId] || 0;
    const newScore = Math.max(-100, Math.min(100, currentScore + delta));
    newRelationships[characterId] = newScore;
  });

  return newRelationships;
}

/**
 * Apply evidence changes
 */
export function applyEvidenceChanges(
  currentEvidence: string[],
  changes?: { add?: string[]; remove?: string[] }
): string[] {
  if (!changes) return currentEvidence;

  let newEvidence = [...currentEvidence];

  // Remove evidence
  if (changes.remove) {
    newEvidence = newEvidence.filter((item) => !changes.remove!.includes(item));
  }

  // Add new evidence (avoiding duplicates)
  if (changes.add) {
    changes.add.forEach((item) => {
      if (!newEvidence.includes(item)) {
        newEvidence.push(item);
      }
    });
  }

  return newEvidence;
}

/**
 * Collect all state changes from a scene and/or choice
 */
export function collectStateChanges(
  scene: Scene,
  choice?: Choice
): TransitionStateChanges {
  const changes: TransitionStateChanges = {};

  // Collect scene-level changes
  if (scene.flagChanges) {
    changes.flags = scene.flagChanges;
  }
  if (scene.itemChanges) {
    changes.items = scene.itemChanges;
  }
  if (scene.relationshipChanges) {
    changes.relationships = scene.relationshipChanges;
  }
  if (scene.evidenceChanges) {
    changes.evidence = scene.evidenceChanges;
  }

  // Merge choice-level changes (choice changes override scene changes)
  if (choice) {
    if (choice.flagChanges) {
      changes.flags = {
        set: [
          ...(changes.flags?.set || []),
          ...(choice.flagChanges.set || []),
        ],
        unset: [
          ...(changes.flags?.unset || []),
          ...(choice.flagChanges.unset || []),
        ],
      };
    }
    if (choice.itemChanges) {
      changes.items = {
        add: [
          ...(changes.items?.add || []),
          ...(choice.itemChanges.add || []),
        ],
        remove: [
          ...(changes.items?.remove || []),
          ...(choice.itemChanges.remove || []),
        ],
      };
    }
    if (choice.relationshipChanges) {
      changes.relationships = {
        ...changes.relationships,
        ...choice.relationshipChanges,
      };
    }
    if (choice.evidenceChanges) {
      changes.evidence = {
        add: [
          ...(changes.evidence?.add || []),
          ...(choice.evidenceChanges.add || []),
        ],
        remove: [
          ...(changes.evidence?.remove || []),
          ...(choice.evidenceChanges.remove || []),
        ],
      };
    }
  }

  return changes;
}

/**
 * Get the next scene ID from a choice or scene's nextScene property
 */
export function getNextSceneId(scene: Scene, choice?: Choice): string | null {
  if (choice) {
    return choice.nextScene;
  }
  return scene.nextScene || null;
}

/**
 * Check if a choice's requirements are met
 */
export function checkChoiceRequirements(
  choice: Choice,
  state: {
    inventory: string[];
    flags: string[];
    relationships: { [characterId: string]: number };
    evidence: string[];
  }
): { canSelect: boolean; reason?: string } {
  if (!choice.requirements) {
    return { canSelect: true };
  }

  const {
    items,
    notItems,
    flags,
    notFlags,
    relationships,
    maxRelationships,
    evidence,
    notEvidence,
  } = choice.requirements;

  // Check required items (must HAVE these)
  if (items && items.length > 0) {
    const missingItems = items.filter((item) => !state.inventory.includes(item));
    if (missingItems.length > 0) {
      return {
        canSelect: false,
        reason: `Requires: ${missingItems.join(', ')}`,
      };
    }
  }

  // Check forbidden items (must NOT have these)
  if (notItems && notItems.length > 0) {
    const forbiddenItems = notItems.filter((item) =>
      state.inventory.includes(item)
    );
    if (forbiddenItems.length > 0) {
      return {
        canSelect: false,
        reason: `Cannot have: ${forbiddenItems.join(', ')}`,
      };
    }
  }

  // Check required flags (must HAVE these)
  if (flags && flags.length > 0) {
    const missingFlags = flags.filter((flag) => !state.flags.includes(flag));
    if (missingFlags.length > 0) {
      return {
        canSelect: false,
        reason: `Requires flags: ${missingFlags.join(', ')}`,
      };
    }
  }

  // Check forbidden flags (must NOT have these)
  if (notFlags && notFlags.length > 0) {
    const forbiddenFlags = notFlags.filter((flag) => state.flags.includes(flag));
    if (forbiddenFlags.length > 0) {
      return {
        canSelect: false,
        reason: `Cannot have flags: ${forbiddenFlags.join(', ')}`,
      };
    }
  }

  // Check minimum relationship requirements (must be >= score)
  if (relationships) {
    for (const [characterId, requiredScore] of Object.entries(relationships)) {
      const currentScore = state.relationships[characterId] || 0;
      if (currentScore < requiredScore) {
        return {
          canSelect: false,
          reason: `Requires ${characterId} relationship ≥ ${requiredScore} (current: ${currentScore})`,
        };
      }
    }
  }

  // Check maximum relationship requirements (must be <= score)
  if (maxRelationships) {
    for (const [characterId, maxScore] of Object.entries(maxRelationships)) {
      const currentScore = state.relationships[characterId] || 0;
      if (currentScore > maxScore) {
        return {
          canSelect: false,
          reason: `Requires ${characterId} relationship ≤ ${maxScore} (current: ${currentScore})`,
        };
      }
    }
  }

  // Check required evidence (must HAVE these)
  if (evidence && evidence.length > 0) {
    const missingEvidence = evidence.filter(
      (item) => !state.evidence.includes(item)
    );
    if (missingEvidence.length > 0) {
      return {
        canSelect: false,
        reason: `Requires evidence: ${missingEvidence.join(', ')}`,
      };
    }
  }

  // Check forbidden evidence (must NOT have these)
  if (notEvidence && notEvidence.length > 0) {
    const forbiddenEvidence = notEvidence.filter((item) =>
      state.evidence.includes(item)
    );
    if (forbiddenEvidence.length > 0) {
      return {
        canSelect: false,
        reason: `Cannot have evidence: ${forbiddenEvidence.join(', ')}`,
      };
    }
  }

  return { canSelect: true };
}

/**
 * Filter choices to only show those that meet requirements
 * (or show all choices but mark unavailable ones as disabled)
 */
export function filterAvailableChoices(
  choices: Choice[],
  state: {
    inventory: string[];
    flags: string[];
    relationships: { [characterId: string]: number };
    evidence: string[];
  },
  hideUnavailable = false
): Choice[] {
  if (hideUnavailable) {
    // Only return choices that can be selected
    return choices.filter((choice) => {
      const { canSelect } = checkChoiceRequirements(choice, state);
      return canSelect;
    });
  }
  // Return all choices (caller can check availability separately)
  return choices;
}

/**
 * Get enriched choice data with availability information
 */
export function getChoicesWithAvailability(
  choices: Choice[],
  state: {
    inventory: string[];
    flags: string[];
    relationships: { [characterId: string]: number };
    evidence: string[];
  }
): Array<Choice & { isAvailable: boolean; lockReason?: string }> {
  return choices.map((choice) => {
    const { canSelect, reason } = checkChoiceRequirements(choice, state);
    return {
      ...choice,
      isAvailable: canSelect,
      lockReason: reason,
    };
  });
}
