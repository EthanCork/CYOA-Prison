/**
 * Core type definitions for El Palo de Queso
 */

/**
 * Types of scenes in the game
 */
export type SceneType =
  | 'narrative'      // Standard story scene
  | 'choice'         // Scene with player choices
  | 'investigation'  // Investigation/examination scene
  | 'dialogue'       // Character dialogue scene
  | 'ending';        // Game ending scene

/**
 * Content for a scene including visual, text, and speaker
 */
export interface SceneContent {
  /** Visual element (image path, background, character sprite) */
  visual?: string;
  /** The narrative text or dialogue */
  text: string;
  /** The character speaking (if any) */
  speaker?: string;
}

/**
 * Represents a choice the player can make in a scene
 */
export interface Choice {
  /** The text displayed to the player for this choice */
  text: string;
  /** The ID of the scene to navigate to when this choice is selected */
  nextScene: string;
  /** Optional requirements that must be met for this choice to be available */
  requirements?: ChoiceRequirements;
  /** Flag changes that occur when this choice is selected */
  flagChanges?: {
    set?: string[];
    unset?: string[];
  };
  /** Item changes that occur when this choice is selected */
  itemChanges?: {
    add?: string[];
    remove?: string[];
  };
  /** Relationship changes that occur when this choice is selected */
  relationshipChanges?: {
    [characterId: string]: number;
  };
  /** Evidence changes that occur when this choice is selected */
  evidenceChanges?: {
    add?: string[];
    remove?: string[];
  };
}

/**
 * Requirements that must be met for a choice to be available
 */
export interface ChoiceRequirements {
  /** Items that must be in the player's inventory */
  items?: string[];
  /** Items that must NOT be in the player's inventory */
  notItems?: string[];
  /** Flags that must be set to true */
  flags?: string[];
  /** Flags that must NOT be set */
  notFlags?: string[];
  /** Minimum relationship scores required with characters */
  relationships?: {
    [characterId: string]: number;
  };
  /** Maximum relationship scores (character score must be <= this value) */
  maxRelationships?: {
    [characterId: string]: number;
  };
  /** Evidence that must be collected */
  evidence?: string[];
  /** Evidence that must NOT be collected */
  notEvidence?: string[];
}

/**
 * Represents a character in the game
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Display name of the character */
  name: string;
  /** Current relationship score with the player (-100 to 100) */
  relationshipScore: number;
  /** Description of the character */
  description: string;
}

/**
 * Represents a scene in the game
 */
export interface Scene {
  /** Unique identifier for the scene (format: X-0-001, A-1-015, etc.) */
  id: string;
  /** Type of scene */
  type: SceneType;
  /** The content of the scene (visual, text, speaker) */
  content: SceneContent;
  /** Available choices for the player in this scene */
  choices: Choice[];
  /** Default next scene if no choices are available (for narrative scenes) */
  nextScene?: string;
  /** Requirements that must be met to access this scene */
  requirements?: ChoiceRequirements;
  /** Flag changes that occur when this scene is visited */
  flagChanges?: {
    set?: string[];
    unset?: string[];
  };
  /** Item changes that occur when this scene is visited */
  itemChanges?: {
    add?: string[];
    remove?: string[];
  };
  /** Relationship changes that occur when this scene is visited */
  relationshipChanges?: {
    [characterId: string]: number;
  };
  /** Evidence changes that occur when this scene is visited */
  evidenceChanges?: {
    add?: string[];
    remove?: string[];
  };
}

/**
 * Represents the current state of the game
 */
export interface GameState {
  /** ID of the current scene the player is in */
  currentScene: string;
  /** History of visited scene IDs (for back navigation) */
  sceneHistory: string[];
  /** Items in the player's inventory */
  inventory: string[];
  /** Relationship scores with all characters */
  relationships: {
    [characterId: string]: number;
  };
  /** Flags that have been set during gameplay */
  flags: string[];
  /** Evidence collected by the player */
  evidence: string[];
}

/**
 * Item that can be collected and used in the game
 */
export interface Item {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Description of the item */
  description: string;
}

/**
 * Evidence that can be collected during investigation
 */
export interface Evidence {
  /** Unique identifier for the evidence */
  id: string;
  /** Display name of the evidence */
  name: string;
  /** Description of the evidence */
  description: string;
}
