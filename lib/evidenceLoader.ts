/**
 * Evidence loader utility for El Palo de Queso
 * Loads and manages evidence data for justice-focused paths
 */

import type { Evidence } from '@/types';
import evidenceData from '@/data/evidence.json';

/**
 * Interface for the evidence JSON structure
 */
interface EvidenceJSON {
  evidence: Evidence[];
}

/**
 * Cached evidence for performance
 */
let evidenceCache: Evidence[] | null = null;

/**
 * Load all evidence pieces from the evidence.json file
 * @returns Array of all evidence
 */
export function loadAllEvidence(): Evidence[] {
  if (evidenceCache) {
    return evidenceCache;
  }

  const data = evidenceData as EvidenceJSON;
  evidenceCache = data.evidence;
  return evidenceCache;
}

/**
 * Get a specific evidence piece by its ID
 * @param evidenceId - The unique identifier of the evidence
 * @returns The evidence if found, undefined otherwise
 */
export function getEvidenceById(evidenceId: string): Evidence | undefined {
  const allEvidence = loadAllEvidence();
  return allEvidence.find(ev => ev.id === evidenceId);
}

/**
 * Get total number of evidence pieces
 * @returns Total count of all evidence
 */
export function getTotalEvidenceCount(): number {
  return loadAllEvidence().length;
}

/**
 * Search evidence by name or description
 * @param searchTerm - The term to search for (case-insensitive)
 * @returns Array of evidence matching the search term
 */
export function searchEvidence(searchTerm: string): Evidence[] {
  const allEvidence = loadAllEvidence();
  const lowerSearchTerm = searchTerm.toLowerCase();

  return allEvidence.filter(ev =>
    ev.name.toLowerCase().includes(lowerSearchTerm) ||
    ev.description.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Validate that an evidence ID exists
 * @param evidenceId - The evidence ID to validate
 * @returns True if the evidence exists, false otherwise
 */
export function isValidEvidenceId(evidenceId: string): boolean {
  return getEvidenceById(evidenceId) !== undefined;
}

/**
 * Get all evidence IDs
 * @returns Array of all evidence IDs
 */
export function getAllEvidenceIds(): string[] {
  return loadAllEvidence().map(ev => ev.id);
}

/**
 * Get evidence related to corruption
 * @returns Evidence pieces that document corruption
 */
export function getCorruptionEvidence(): Evidence[] {
  return searchEvidence('corruption').concat(
    searchEvidence('bribe'),
    searchEvidence('payment'),
    searchEvidence('ledger')
  ).filter((ev, index, self) =>
    // Remove duplicates
    index === self.findIndex(e => e.id === ev.id)
  );
}

/**
 * Get evidence related to brutality and abuse
 * @returns Evidence pieces that document violence and abuse
 */
export function getBrutalityEvidence(): Evidence[] {
  return searchEvidence('brutal').concat(
    searchEvidence('torture'),
    searchEvidence('abuse'),
    searchEvidence('photo')
  ).filter((ev, index, self) =>
    index === self.findIndex(e => e.id === ev.id)
  );
}

/**
 * Get evidence that could prove player innocence
 * @returns Evidence pieces related to the player's case
 */
export function getInnocenceEvidence(): Evidence[] {
  return loadAllEvidence().filter(ev =>
    ev.id.includes('innocence') ||
    ev.description.toLowerCase().includes('exonerate') ||
    ev.description.toLowerCase().includes('prove your innocence')
  );
}

/**
 * Calculate evidence collection progress
 * @param collectedEvidence - Array of collected evidence IDs
 * @returns Object with count and percentage
 */
export function getEvidenceProgress(collectedEvidence: string[]): {
  collected: number;
  total: number;
  percentage: number;
} {
  const total = getTotalEvidenceCount();
  const collected = collectedEvidence.length;
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return { collected, total, percentage };
}

/**
 * Check if player has enough evidence for a justice ending
 * @param collectedEvidence - Array of collected evidence IDs
 * @param minimumRequired - Minimum pieces needed (default: 5)
 * @returns True if player has enough evidence
 */
export function hasEnoughEvidenceForJustice(
  collectedEvidence: string[],
  minimumRequired: number = 5
): boolean {
  return collectedEvidence.length >= minimumRequired;
}

/**
 * Get categories of evidence based on what's been collected
 * @param collectedEvidence - Array of collected evidence IDs
 * @returns Object with boolean flags for each category
 */
export function getEvidenceCategories(collectedEvidence: string[]): {
  hasCorruption: boolean;
  hasBrutality: boolean;
  hasInnocence: boolean;
  hasSystemic: boolean; // Missing prisoners, conspiracies
} {
  const collected = collectedEvidence.map(id => getEvidenceById(id)).filter(Boolean) as Evidence[];

  const hasCorruption = collected.some(ev =>
    ev.description.toLowerCase().includes('corruption') ||
    ev.description.toLowerCase().includes('bribe') ||
    ev.id.includes('ledger') ||
    ev.id.includes('payment')
  );

  const hasBrutality = collected.some(ev =>
    ev.description.toLowerCase().includes('brutal') ||
    ev.description.toLowerCase().includes('torture') ||
    ev.description.toLowerCase().includes('abuse') ||
    ev.id.includes('photo')
  );

  const hasInnocence = collected.some(ev =>
    ev.description.toLowerCase().includes('innocence') ||
    ev.description.toLowerCase().includes('exonerate')
  );

  const hasSystemic = collected.some(ev =>
    ev.description.toLowerCase().includes('missing') ||
    ev.description.toLowerCase().includes('conspiracy') ||
    ev.description.toLowerCase().includes('systematic')
  );

  return { hasCorruption, hasBrutality, hasInnocence, hasSystemic };
}

/**
 * Clear the evidence cache (useful for testing)
 */
export function clearEvidenceCache(): void {
  evidenceCache = null;
}
