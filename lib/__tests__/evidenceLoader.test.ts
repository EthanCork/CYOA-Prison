/**
 * Tests for evidence loader utility
 */

import {
  loadAllEvidence,
  getEvidenceById,
  getTotalEvidenceCount,
  searchEvidence,
  isValidEvidenceId,
  getAllEvidenceIds,
  getCorruptionEvidence,
  getBrutalityEvidence,
  getInnocenceEvidence,
  getEvidenceProgress,
  hasEnoughEvidenceForJustice,
  getEvidenceCategories,
  clearEvidenceCache,
} from '../evidenceLoader';

describe('Evidence Loader', () => {
  beforeEach(() => {
    clearEvidenceCache();
  });

  describe('loadAllEvidence', () => {
    it('should load all evidence pieces', () => {
      const evidence = loadAllEvidence();
      expect(evidence).toBeDefined();
      expect(Array.isArray(evidence)).toBe(true);
      expect(evidence.length).toBeGreaterThan(0);
    });

    it('should have exactly 9 evidence pieces', () => {
      const evidence = loadAllEvidence();
      expect(evidence).toHaveLength(9);
    });

    it('should cache evidence for subsequent calls', () => {
      const firstCall = loadAllEvidence();
      const secondCall = loadAllEvidence();
      expect(firstCall).toBe(secondCall); // Same reference
    });

    it('should have all required fields for each evidence', () => {
      const evidence = loadAllEvidence();

      evidence.forEach((ev) => {
        expect(ev.id).toBeDefined();
        expect(ev.name).toBeDefined();
        expect(ev.description).toBeDefined();
        expect(typeof ev.id).toBe('string');
        expect(typeof ev.name).toBe('string');
        expect(typeof ev.description).toBe('string');
      });
    });
  });

  describe('getEvidenceById', () => {
    it('should retrieve evidence by ID', () => {
      const evidence = getEvidenceById('warden_ledger');
      expect(evidence).toBeDefined();
      expect(evidence?.id).toBe('warden_ledger');
      expect(evidence?.name).toContain('Ledger');
    });

    it('should return undefined for non-existent ID', () => {
      const evidence = getEvidenceById('nonexistent');
      expect(evidence).toBeUndefined();
    });

    it('should retrieve all evidence pieces by their IDs', () => {
      const allEvidence = loadAllEvidence();

      allEvidence.forEach((ev) => {
        const retrieved = getEvidenceById(ev.id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(ev.id);
      });
    });
  });

  describe('getTotalEvidenceCount', () => {
    it('should return 9', () => {
      expect(getTotalEvidenceCount()).toBe(9);
    });

    it('should match loadAllEvidence length', () => {
      const evidence = loadAllEvidence();
      expect(getTotalEvidenceCount()).toBe(evidence.length);
    });
  });

  describe('searchEvidence', () => {
    it('should find evidence by name', () => {
      const results = searchEvidence('ledger');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((ev) => ev.name.toLowerCase().includes('ledger'))).toBe(true);
    });

    it('should find evidence by description', () => {
      const results = searchEvidence('corruption');
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((ev) => ev.description.toLowerCase().includes('corruption'))
      ).toBe(true);
    });

    it('should be case-insensitive', () => {
      const lower = searchEvidence('dna');
      const upper = searchEvidence('DNA');
      expect(lower).toEqual(upper);
    });

    it('should return empty array for no matches', () => {
      const results = searchEvidence('nonexistent_term_xyz');
      expect(results).toEqual([]);
    });
  });

  describe('isValidEvidenceId', () => {
    it('should return true for valid IDs', () => {
      expect(isValidEvidenceId('warden_ledger')).toBe(true);
      expect(isValidEvidenceId('guard_brutality_photos')).toBe(true);
      expect(isValidEvidenceId('innocence_dna_report')).toBe(true);
    });

    it('should return false for invalid IDs', () => {
      expect(isValidEvidenceId('invalid_id')).toBe(false);
      expect(isValidEvidenceId('')).toBe(false);
    });
  });

  describe('getAllEvidenceIds', () => {
    it('should return array of all evidence IDs', () => {
      const ids = getAllEvidenceIds();
      expect(ids).toHaveLength(9);
      expect(ids).toContain('warden_ledger');
      expect(ids).toContain('guard_brutality_photos');
    });

    it('should return strings only', () => {
      const ids = getAllEvidenceIds();
      ids.forEach((id) => {
        expect(typeof id).toBe('string');
      });
    });
  });

  describe('getCorruptionEvidence', () => {
    it('should return corruption-related evidence', () => {
      const corruption = getCorruptionEvidence();
      expect(corruption.length).toBeGreaterThan(0);
    });

    it('should include warden ledger', () => {
      const corruption = getCorruptionEvidence();
      expect(corruption.some((ev) => ev.id === 'warden_ledger')).toBe(true);
    });

    it('should not have duplicates', () => {
      const corruption = getCorruptionEvidence();
      const ids = corruption.map((ev) => ev.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  describe('getBrutalityEvidence', () => {
    it('should return brutality-related evidence', () => {
      const brutality = getBrutalityEvidence();
      expect(brutality.length).toBeGreaterThan(0);
    });

    it('should include guard brutality photos', () => {
      const brutality = getBrutalityEvidence();
      expect(brutality.some((ev) => ev.id === 'guard_brutality_photos')).toBe(true);
    });

    it('should include torture log', () => {
      const brutality = getBrutalityEvidence();
      expect(brutality.some((ev) => ev.id === 'solitary_torture_log')).toBe(true);
    });
  });

  describe('getInnocenceEvidence', () => {
    it('should return innocence-related evidence', () => {
      const innocence = getInnocenceEvidence();
      expect(innocence.length).toBeGreaterThan(0);
    });

    it('should include DNA report', () => {
      const innocence = getInnocenceEvidence();
      expect(innocence.some((ev) => ev.id === 'innocence_dna_report')).toBe(true);
    });
  });

  describe('getEvidenceProgress', () => {
    it('should calculate progress correctly with no evidence', () => {
      const progress = getEvidenceProgress([]);
      expect(progress.collected).toBe(0);
      expect(progress.total).toBe(9);
      expect(progress.percentage).toBe(0);
    });

    it('should calculate progress correctly with some evidence', () => {
      const progress = getEvidenceProgress(['warden_ledger', 'guard_brutality_photos']);
      expect(progress.collected).toBe(2);
      expect(progress.total).toBe(9);
      expect(progress.percentage).toBe(22); // 2/9 = 22.22% rounded to 22
    });

    it('should calculate progress correctly with all evidence', () => {
      const allIds = getAllEvidenceIds();
      const progress = getEvidenceProgress(allIds);
      expect(progress.collected).toBe(9);
      expect(progress.total).toBe(9);
      expect(progress.percentage).toBe(100);
    });

    it('should handle invalid evidence IDs gracefully', () => {
      const progress = getEvidenceProgress(['invalid1', 'invalid2']);
      expect(progress.collected).toBe(2); // Still counts them
      expect(progress.total).toBe(9);
    });
  });

  describe('hasEnoughEvidenceForJustice', () => {
    it('should return false with less than 5 pieces', () => {
      expect(hasEnoughEvidenceForJustice(['ev1', 'ev2', 'ev3', 'ev4'])).toBe(false);
    });

    it('should return true with exactly 5 pieces', () => {
      expect(hasEnoughEvidenceForJustice(['ev1', 'ev2', 'ev3', 'ev4', 'ev5'])).toBe(true);
    });

    it('should return true with more than 5 pieces', () => {
      expect(hasEnoughEvidenceForJustice(['ev1', 'ev2', 'ev3', 'ev4', 'ev5', 'ev6'])).toBe(
        true
      );
    });

    it('should accept custom minimum requirement', () => {
      expect(hasEnoughEvidenceForJustice(['ev1', 'ev2'], 2)).toBe(true);
      expect(hasEnoughEvidenceForJustice(['ev1', 'ev2'], 3)).toBe(false);
    });

    it('should return false with no evidence', () => {
      expect(hasEnoughEvidenceForJustice([])).toBe(false);
    });
  });

  describe('getEvidenceCategories', () => {
    it('should identify corruption evidence', () => {
      const categories = getEvidenceCategories(['warden_ledger']);
      expect(categories.hasCorruption).toBe(true);
    });

    it('should identify brutality evidence', () => {
      const categories = getEvidenceCategories(['guard_brutality_photos']);
      expect(categories.hasBrutality).toBe(true);
    });

    it('should identify innocence evidence', () => {
      const categories = getEvidenceCategories(['innocence_dna_report']);
      expect(categories.hasInnocence).toBe(true);
    });

    it('should identify systemic evidence', () => {
      const categories = getEvidenceCategories(['missing_prisoner_list']);
      expect(categories.hasSystemic).toBe(true);
    });

    it('should return all false for no evidence', () => {
      const categories = getEvidenceCategories([]);
      expect(categories.hasCorruption).toBe(false);
      expect(categories.hasBrutality).toBe(false);
      expect(categories.hasInnocence).toBe(false);
      expect(categories.hasSystemic).toBe(false);
    });

    it('should identify multiple categories', () => {
      const categories = getEvidenceCategories([
        'warden_ledger',
        'guard_brutality_photos',
        'innocence_dna_report',
      ]);
      expect(categories.hasCorruption).toBe(true);
      expect(categories.hasBrutality).toBe(true);
      expect(categories.hasInnocence).toBe(true);
    });

    it('should handle invalid evidence IDs', () => {
      const categories = getEvidenceCategories(['invalid_id']);
      expect(categories.hasCorruption).toBe(false);
      expect(categories.hasBrutality).toBe(false);
      expect(categories.hasInnocence).toBe(false);
      expect(categories.hasSystemic).toBe(false);
    });
  });

  describe('Evidence Content Validation', () => {
    it('should have warden ledger with corruption details', () => {
      const ev = getEvidenceById('warden_ledger');
      expect(ev?.description).toContain('corruption');
      expect(ev?.description).toContain('Warden Vásquez');
    });

    it('should have guard brutality photos with abuse details', () => {
      const ev = getEvidenceById('guard_brutality_photos');
      expect(ev?.description).toContain('abuse');
      expect(ev?.description).toContain('guards');
    });

    it('should have DNA report with innocence details', () => {
      const ev = getEvidenceById('innocence_dna_report');
      expect(ev?.description).toContain('innocence');
      expect(ev?.description).toContain('DNA');
    });

    it('should have missing prisoner list with systemic details', () => {
      const ev = getEvidenceById('missing_prisoner_list');
      expect(ev?.description).toContain('disappearances');
      expect(ev?.description).toContain('prisoner');
    });
  });
});
