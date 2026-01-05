/**
 * Utility functions for relationship score visualization
 */

/**
 * Get the color class for a relationship score
 * @param score - Relationship score from -100 to 100
 * @returns Tailwind color class
 */
export function getRelationshipColor(score: number): string {
  if (score >= 60) return 'text-green-600';
  if (score >= 20) return 'text-green-500';
  if (score >= -10) return 'text-yellow-600';
  if (score >= -40) return 'text-orange-500';
  return 'text-red-600';
}

/**
 * Get the background color class for a relationship score
 * @param score - Relationship score from -100 to 100
 * @returns Tailwind background color class
 */
export function getRelationshipBgColor(score: number): string {
  if (score >= 60) return 'bg-green-100';
  if (score >= 20) return 'bg-green-50';
  if (score >= -10) return 'bg-yellow-50';
  if (score >= -40) return 'bg-orange-50';
  return 'bg-red-50';
}

/**
 * Get the border color class for a relationship score
 * @param score - Relationship score from -100 to 100
 * @returns Tailwind border color class
 */
export function getRelationshipBorderColor(score: number): string {
  if (score >= 60) return 'border-green-600';
  if (score >= 20) return 'border-green-500';
  if (score >= -10) return 'border-yellow-600';
  if (score >= -40) return 'border-orange-500';
  return 'border-red-600';
}

/**
 * Get the progress bar color class for a relationship score
 * @param score - Relationship score from -100 to 100
 * @returns Tailwind background color class for progress bar
 */
export function getRelationshipProgressColor(score: number): string {
  if (score >= 60) return 'bg-green-600';
  if (score >= 20) return 'bg-green-500';
  if (score >= -10) return 'bg-yellow-600';
  if (score >= -40) return 'bg-orange-500';
  return 'bg-red-600';
}

/**
 * Get a descriptive label for a relationship score
 * @param score - Relationship score from -100 to 100
 * @returns Descriptive label
 */
export function getRelationshipLabel(score: number): string {
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
 * Get an emoji representing the relationship status
 * @param score - Relationship score from -100 to 100
 * @returns Emoji character
 */
export function getRelationshipEmoji(score: number): string {
  if (score >= 80) return '💚';
  if (score >= 60) return '💙';
  if (score >= 40) return '💛';
  if (score >= 20) return '🙂';
  if (score >= 10) return '😐';
  if (score >= -10) return '😑';
  if (score >= -20) return '😠';
  if (score >= -40) return '😡';
  if (score >= -60) return '🔥';
  if (score >= -80) return '💀';
  return '⚔️';
}

/**
 * Get category emoji for character categories
 * @param category - Character category
 * @returns Emoji character
 */
export function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'ally':
      return '🤝';
    case 'antagonist':
      return '⚠️';
    case 'neutral':
      return '🔘';
    case 'referenced':
      return '💭';
    default:
      return '👤';
  }
}
