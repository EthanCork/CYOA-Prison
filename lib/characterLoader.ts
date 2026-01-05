/**
 * Character loader utility for El Palo de Queso
 * Loads and manages NPC character data from JSON files
 */

import type { Character } from '@/types';
import charactersData from '@/data/characters.json';

/**
 * Interface for the characters JSON structure
 */
interface CharactersJSON {
  characters: Character[];
}

/**
 * Cached characters for performance
 */
let charactersCache: Character[] | null = null;

/**
 * Load all characters from the characters.json file
 * @returns Array of all characters
 */
export function loadAllCharacters(): Character[] {
  if (charactersCache) {
    return charactersCache;
  }

  const data = charactersData as CharactersJSON;
  charactersCache = data.characters;
  return charactersCache;
}

/**
 * Get a specific character by their ID
 * @param characterId - The unique identifier of the character
 * @returns The character if found, undefined otherwise
 */
export function getCharacterById(characterId: string): Character | undefined {
  const characters = loadAllCharacters();
  return characters.find(char => char.id === characterId);
}

/**
 * Get initial relationship scores for all characters
 * @returns Object mapping character IDs to their initial relationship scores
 */
export function getInitialRelationships(): Record<string, number> {
  const characters = loadAllCharacters();
  const relationships: Record<string, number> = {};

  characters.forEach(char => {
    relationships[char.id] = char.initialRelationship;
  });

  return relationships;
}

/**
 * Get characters by location
 * @param location - The location to filter by
 * @returns Array of characters at the specified location
 */
export function getCharactersByLocation(location: string): Character[] {
  const characters = loadAllCharacters();
  return characters.filter(char =>
    char.location.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Get characters by role
 * @param role - The role to filter by
 * @returns Array of characters with the specified role
 */
export function getCharactersByRole(role: string): Character[] {
  const characters = loadAllCharacters();
  return characters.filter(char =>
    char.role.toLowerCase().includes(role.toLowerCase())
  );
}

/**
 * Search characters by name or description
 * @param searchTerm - The term to search for (case-insensitive)
 * @returns Array of characters matching the search term
 */
export function searchCharacters(searchTerm: string): Character[] {
  const characters = loadAllCharacters();
  const lowerSearchTerm = searchTerm.toLowerCase();

  return characters.filter(char =>
    char.name.toLowerCase().includes(lowerSearchTerm) ||
    char.description.toLowerCase().includes(lowerSearchTerm) ||
    char.role.toLowerCase().includes(lowerSearchTerm) ||
    char.background.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Validate that a character ID exists
 * @param characterId - The character ID to validate
 * @returns True if the character exists, false otherwise
 */
export function isValidCharacterId(characterId: string): boolean {
  return getCharacterById(characterId) !== undefined;
}

/**
 * Get total number of characters
 * @returns Total count of all characters
 */
export function getTotalCharacterCount(): number {
  return loadAllCharacters().length;
}

/**
 * Get relationship status description based on score
 * @param score - The relationship score (-100 to 100)
 * @returns Description of the relationship status
 */
export function getRelationshipStatus(score: number): string {
  if (score >= 80) return 'Devoted Ally';
  if (score >= 60) return 'Trusted Friend';
  if (score >= 40) return 'Good Friend';
  if (score >= 20) return 'Friendly';
  if (score >= 10) return 'Acquaintance';
  if (score >= -10) return 'Neutral';
  if (score >= -20) return 'Unfriendly';
  if (score >= -40) return 'Hostile';
  if (score >= -60) return 'Enemy';
  if (score >= -80) return 'Bitter Enemy';
  return 'Mortal Enemy';
}

/**
 * Get all character IDs
 * @returns Array of all character IDs
 */
export function getAllCharacterIds(): string[] {
  return loadAllCharacters().map(char => char.id);
}

/**
 * Get characters by category
 * @param category - The category to filter by ('ally', 'neutral', 'antagonist', 'referenced')
 * @returns Array of characters in the specified category
 */
export function getCharactersByCategory(category: string): Character[] {
  const characters = loadAllCharacters();
  return characters.filter(char => char.category === category);
}

/**
 * Get unlocked content for a character based on current relationship score
 * @param characterId - The character ID
 * @param currentScore - The current relationship score
 * @returns Array of unlocked content descriptions
 */
export function getUnlockedContent(characterId: string, currentScore: number): string[] {
  const character = getCharacterById(characterId);
  if (!character) return [];

  const unlocked: string[] = [];
  const unlocks = character.unlocks;

  Object.entries(unlocks).forEach(([threshold, description]) => {
    const thresholdNum = parseInt(threshold);
    if (currentScore >= thresholdNum) {
      unlocked.push(description);
    }
  });

  return unlocked;
}

/**
 * Get next unlock threshold for a character
 * @param characterId - The character ID
 * @param currentScore - The current relationship score
 * @returns Next unlock threshold and description, or null if all unlocked
 */
export function getNextUnlock(characterId: string, currentScore: number): { threshold: number; description: string } | null {
  const character = getCharacterById(characterId);
  if (!character) return null;

  const unlocks = character.unlocks;
  const sortedThresholds = Object.keys(unlocks)
    .map(t => parseInt(t))
    .sort((a, b) => a - b);

  for (const threshold of sortedThresholds) {
    if (currentScore < threshold) {
      return {
        threshold,
        description: unlocks[threshold.toString()],
      };
    }
  }

  return null; // All content unlocked
}

/**
 * Check if a specific relationship threshold has been reached
 * @param characterId - The character ID
 * @param thresholdName - The name of the threshold (e.g., 'trusted', 'friend')
 * @param currentScore - The current relationship score
 * @returns True if the threshold has been reached
 */
export function hasReachedThreshold(
  characterId: string,
  thresholdName: string,
  currentScore: number
): boolean {
  const character = getCharacterById(characterId);
  if (!character) return false;

  const threshold = character.relationshipThresholds[thresholdName];
  return threshold !== undefined && currentScore >= threshold;
}

/**
 * Get all allies (characters with 'ally' category)
 * @returns Array of ally characters
 */
export function getAllies(): Character[] {
  return getCharactersByCategory('ally');
}

/**
 * Get all antagonists (characters with 'antagonist' category)
 * @returns Array of antagonist characters
 */
export function getAntagonists(): Character[] {
  return getCharactersByCategory('antagonist');
}

/**
 * Get all neutral characters
 * @returns Array of neutral characters
 */
export function getNeutralCharacters(): Character[] {
  return getCharactersByCategory('neutral');
}

/**
 * Get all referenced characters (mentioned but not directly interactable)
 * @returns Array of referenced characters
 */
export function getReferencedCharacters(): Character[] {
  return getCharactersByCategory('referenced');
}

/**
 * Clear the characters cache (useful for testing)
 */
export function clearCharactersCache(): void {
  charactersCache = null;
}
