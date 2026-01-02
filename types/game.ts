/**
 * Core type definitions for El Palo de Queso
 */

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
}

/**
 * Requirements that must be met for a choice to be available
 */
export interface ChoiceRequirements {
  /** Items that must be in the player's inventory */
  items?: string[];
  /** Flags that must be set to true */
  flags?: string[];
  /** Minimum relationship scores required with characters */
  relationships?: {
    [characterId: string]: number;
  };
  /** Evidence that must be collected */
  evidence?: string[];
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
  /** Unique identifier for the scene */
  id: string;
  /** The main text/narrative content of the scene */
  content: string;
  /** Available choices for the player in this scene */
  choices: Choice[];
  /** Flags that are set when this scene is visited */
  flags?: string[];
  /** Items that can be obtained in this scene */
  items?: string[];
  /** Relationship changes that occur in this scene */
  relationships?: {
    [characterId: string]: number;
  };
  /** Evidence that can be collected in this scene */
  evidence?: string[];
}

/**
 * Represents the current state of the game
 */
export interface GameState {
  /** ID of the current scene the player is in */
  currentScene: string;
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
