/**
 * Flag Utilities - Helper functions for managing game flags
 * Flags are boolean state markers that track story progress and decisions
 */

/**
 * Common flag naming conventions for the game
 */
export const FlagCategories = {
  // Story progress flags
  STORY: 'story',
  // Character interaction flags
  CHARACTER: 'char',
  // Location discovery flags
  LOCATION: 'loc',
  // Item usage flags
  ITEM_USED: 'used',
  // Quest/mission flags
  QUEST: 'quest',
  // Ending achievement flags
  ENDING: 'ending',
  // Combat/conflict flags
  COMBAT: 'combat',
  // Discovery/knowledge flags
  DISCOVERED: 'disc',
} as const;

/**
 * Create a namespaced flag name following convention
 * @example createFlagName('story', 'met_warden') => 'story:met_warden'
 */
export function createFlagName(category: string, name: string): string {
  return `${category}:${name}`;
}

/**
 * Parse a flag name into category and name components
 * @example parseFlagName('story:met_warden') => { category: 'story', name: 'met_warden' }
 */
export function parseFlagName(flag: string): { category: string; name: string } | null {
  const parts = flag.split(':');
  if (parts.length !== 2) {
    return null;
  }
  return {
    category: parts[0],
    name: parts[1],
  };
}

/**
 * Get all flags from a specific category
 */
export function getFlagsByCategory(flags: string[], category: string): string[] {
  return flags.filter((flag) => {
    const parsed = parseFlagName(flag);
    return parsed && parsed.category === category;
  });
}

/**
 * Check if multiple flags are all set
 */
export function hasAllFlags(currentFlags: string[], requiredFlags: string[]): boolean {
  return requiredFlags.every((flag) => currentFlags.includes(flag));
}

/**
 * Check if any of the specified flags are set
 */
export function hasAnyFlag(currentFlags: string[], checkFlags: string[]): boolean {
  return checkFlags.some((flag) => currentFlags.includes(flag));
}

/**
 * Check if none of the specified flags are set
 */
export function hasNoFlags(currentFlags: string[], checkFlags: string[]): boolean {
  return !hasAnyFlag(currentFlags, checkFlags);
}

/**
 * Count how many flags from a list are currently set
 */
export function countSetFlags(currentFlags: string[], checkFlags: string[]): number {
  return checkFlags.filter((flag) => currentFlags.includes(flag)).length;
}

/**
 * Get flags that are set from a list of possible flags
 */
export function getSetFlags(currentFlags: string[], possibleFlags: string[]): string[] {
  return possibleFlags.filter((flag) => currentFlags.includes(flag));
}

/**
 * Get flags that are NOT set from a list of possible flags
 */
export function getUnsetFlags(currentFlags: string[], possibleFlags: string[]): string[] {
  return possibleFlags.filter((flag) => !currentFlags.includes(flag));
}

/**
 * Validate flag names follow convention (category:name)
 */
export function isValidFlagName(flag: string): boolean {
  const parsed = parseFlagName(flag);
  return parsed !== null && parsed.category.length > 0 && parsed.name.length > 0;
}

/**
 * Common game flags for El Palo de Queso
 * These can be used across scenes for consistency
 */
export const CommonFlags = {
  // Story progression
  INTRO_COMPLETE: 'story:intro_complete',
  FIRST_DAY_COMPLETE: 'story:first_day_complete',
  MET_WARDEN: 'story:met_warden',
  MET_CELLMATE: 'story:met_cellmate',

  // Character states
  BEFRIENDED_GUARD: 'char:befriended_guard',
  ANTAGONIZED_GUARD: 'char:antagonized_guard',
  TRUSTED_BY_INMATES: 'char:trusted_by_inmates',
  SUSPICIOUS_TO_GUARDS: 'char:suspicious_to_guards',

  // Location discoveries
  FOUND_COURTYARD: 'loc:found_courtyard',
  FOUND_CAFETERIA: 'loc:found_cafeteria',
  FOUND_LIBRARY: 'loc:found_library',
  FOUND_GYM: 'loc:found_gym',
  FOUND_WORKSHOP: 'loc:found_workshop',

  // Item usage
  USED_MASTER_KEY: 'used:master_key',
  USED_LOCKPICK: 'used:lockpick',
  USED_DISGUISE: 'used:disguise',

  // Quest progress
  ACCEPTED_ESCAPE_PLAN: 'quest:accepted_escape_plan',
  COMPLETED_RECON: 'quest:completed_recon',
  GATHERED_SUPPLIES: 'quest:gathered_supplies',

  // Discoveries
  DISCOVERED_SECRET_PASSAGE: 'disc:secret_passage',
  DISCOVERED_GUARD_SCHEDULE: 'disc:guard_schedule',
  DISCOVERED_WARDEN_SECRET: 'disc:warden_secret',

  // Endings
  ENDING_ESCAPE_SUCCESS: 'ending:escape_success',
  ENDING_ESCAPE_FAILED: 'ending:escape_failed',
  ENDING_REFORMED: 'ending:reformed',
  ENDING_GANG_LEADER: 'ending:gang_leader',
} as const;

/**
 * Flag descriptions for debugging and development
 */
export const FlagDescriptions: Record<string, string> = {
  [CommonFlags.INTRO_COMPLETE]: 'Player has completed the introduction sequence',
  [CommonFlags.FIRST_DAY_COMPLETE]: 'Player has completed their first day in prison',
  [CommonFlags.MET_WARDEN]: 'Player has met the warden',
  [CommonFlags.MET_CELLMATE]: 'Player has met their cellmate',
  [CommonFlags.BEFRIENDED_GUARD]: 'Player has developed a positive relationship with a guard',
  [CommonFlags.ANTAGONIZED_GUARD]: 'Player has antagonized a guard',
  [CommonFlags.TRUSTED_BY_INMATES]: 'Player is trusted by other inmates',
  [CommonFlags.SUSPICIOUS_TO_GUARDS]: 'Guards are suspicious of the player',
  [CommonFlags.FOUND_COURTYARD]: 'Player has discovered the courtyard',
  [CommonFlags.FOUND_CAFETERIA]: 'Player has discovered the cafeteria',
  [CommonFlags.FOUND_LIBRARY]: 'Player has discovered the library',
  [CommonFlags.FOUND_GYM]: 'Player has discovered the gym',
  [CommonFlags.FOUND_WORKSHOP]: 'Player has discovered the workshop',
  [CommonFlags.USED_MASTER_KEY]: 'Player has used the master key',
  [CommonFlags.USED_LOCKPICK]: 'Player has used a lockpick',
  [CommonFlags.USED_DISGUISE]: 'Player has used a disguise',
  [CommonFlags.ACCEPTED_ESCAPE_PLAN]: 'Player has accepted the escape plan',
  [CommonFlags.COMPLETED_RECON]: 'Player has completed reconnaissance',
  [CommonFlags.GATHERED_SUPPLIES]: 'Player has gathered escape supplies',
  [CommonFlags.DISCOVERED_SECRET_PASSAGE]: 'Player has discovered a secret passage',
  [CommonFlags.DISCOVERED_GUARD_SCHEDULE]: 'Player has discovered the guard schedule',
  [CommonFlags.DISCOVERED_WARDEN_SECRET]: 'Player has discovered the warden\'s secret',
  [CommonFlags.ENDING_ESCAPE_SUCCESS]: 'Player successfully escaped prison',
  [CommonFlags.ENDING_ESCAPE_FAILED]: 'Player\'s escape attempt failed',
  [CommonFlags.ENDING_REFORMED]: 'Player was reformed and released',
  [CommonFlags.ENDING_GANG_LEADER]: 'Player became a gang leader in prison',
};

/**
 * Get description for a flag (useful for debugging)
 */
export function getFlagDescription(flag: string): string {
  return FlagDescriptions[flag] || 'No description available';
}
