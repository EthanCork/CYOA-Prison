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
  /** Optional pages for multi-page dialogue (if present, text is ignored) */
  pages?: string[];
  /** Optional per-page visuals (if present, overrides visual for each page) */
  pageVisuals?: string[];
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
  /** Resource changes that occur when this choice is selected */
  resourceChanges?: {
    matches?: number;
    health?: number;
    currency?: number;
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
  /** Minimum resource amounts required */
  resources?: {
    matches?: number;
    health?: number;
    currency?: number;
  };
  /** Flags that must be set to true */
  flags?: string | string[];
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
 * Character category type
 */
export type CharacterCategory = 'ally' | 'neutral' | 'antagonist' | 'referenced';

/**
 * Represents a character in the game
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Display name of the character */
  name: string;
  /** Initial relationship score when starting the game (-100 to 100) */
  initialRelationship: number;
  /** Description of the character */
  description: string;
  /** Character's role in the prison */
  role: string;
  /** Character category (ally, neutral, antagonist, referenced) */
  category: CharacterCategory;
  /** Where the character is typically found */
  location: string;
  /** Character traits/personality */
  traits: string[];
  /** Character backstory */
  background: string;
  /** Relationship score thresholds for unlocking content */
  relationshipThresholds: Record<string, number>;
  /** Content/features unlocked at specific relationship scores */
  unlocks: Record<string, string>;
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
  /** Interactive hotspots on the background */
  hotspots?: Hotspot[];
}

/**
 * Interactive hotspot on a scene background
 */
export interface Hotspot {
  /** Unique identifier for this hotspot */
  id: string;
  /** Display label when hovering */
  label: string;
  /** Position on screen (percentage-based for responsiveness) */
  position: {
    x: number; // 0-100 (percentage from left)
    y: number; // 0-100 (percentage from top)
    width: number; // 0-100 (percentage of screen width)
    height: number; // 0-100 (percentage of screen height)
  };
  /** Requirements to make this hotspot visible/interactable */
  requirements?: ChoiceRequirements;
  /** Action that occurs when hotspot is clicked */
  action: HotspotAction;
}

/**
 * Action that occurs when a hotspot is clicked
 */
export interface HotspotAction {
  /** Type of action */
  type: 'examine' | 'take' | 'talk' | 'use' | 'navigate';
  /** Text shown in popup/overlay when examined */
  text?: string;
  /** Scene to navigate to */
  nextScene?: string;
  /** Flag changes that occur */
  flagChanges?: {
    set?: string[];
    unset?: string[];
  };
  /** Item changes that occur */
  itemChanges?: {
    add?: string[];
    remove?: string[];
  };
  /** Evidence changes that occur */
  evidenceChanges?: {
    add?: string[];
    remove?: string[];
  };
  /** Makes this hotspot disappear after interaction */
  oneTime?: boolean;
}

/**
 * Main story paths in the game
 */
export type GamePath = 'A' | 'B' | 'C' | null;

/**
 * Time of day periods (for Path C)
 */
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

/**
 * Day and time tracking (primarily for Path C: Day/Justice)
 */
export interface DayTime {
  /** Current day (1-6 for Path C) */
  day: number;
  /** Current time of day */
  timeOfDay: TimeOfDay;
}

/**
 * Work assignments available to player (Path C)
 */
export type WorkAssignment =
  | 'kitchen'
  | 'laundry'
  | 'yard'
  | 'infirmary'
  | 'chapel'
  | 'library';

/**
 * Player statistics tracking for end-game display
 */
export interface GameStats {
  /** Total number of unique scenes visited */
  scenesVisited: number;
  /** Total number of choices made */
  choicesMade: number;
  /** Total number of unique items found */
  itemsFound: number;
  /** Number of relationships at max positive (100) */
  relationshipsMaxed: number;
  /** Number of relationships at max negative (-100) */
  relationshipsMinned: number;
  /** Highest stage/day reached */
  stageReached: number;
  /** Path taken (A, B, C, or null if not chosen) */
  pathTaken: GamePath;
  /** Total play time in seconds (optional, can be tracked separately) */
  playTimeSeconds?: number;
}

/**
 * Consumable resources (Path A mechanics)
 */
export interface Resources {
  /** Number of matches remaining (Path A) */
  matches: number;
  /** Health/stamina (Path C) */
  health?: number;
  /** Money/currency for bribes */
  currency?: number;
}

/**
 * Represents the current state of the game
 */
export interface GameState {
  /** ID of the current scene the player is in */
  currentScene: string;
  /** History of visited scene IDs (for back navigation) */
  sceneHistory: string[];
  /** Current main story path (A=Night, B=Social, C=Day/Justice) */
  currentPath: GamePath;
  /** Current day and time (Path C only) */
  dayTime: DayTime | null;
  /** Player's work assignment (Path C only) */
  workAssignment: WorkAssignment | null;
  /** Items in the player's inventory */
  inventory: string[];
  /** Consumable resources (matches, health, currency) */
  resources: Resources;
  /** Relationship scores with all characters */
  relationships: {
    [characterId: string]: number;
  };
  /** Characters that the player has discovered/met */
  discoveredCharacters: string[];
  /** Flags that have been set during gameplay */
  flags: string[];
  /** Evidence collected by the player */
  evidence: string[];
  /** Player statistics for end-game display */
  stats: GameStats;
}

/**
 * Category for items
 */
export type ItemCategory = 'tool' | 'disguise' | 'medical' | 'weapon' | 'evidence' | 'misc';

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
  /** Category of the item */
  category: ItemCategory;
  /** Hint about where this item can be found */
  locationHint: string;
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
