/**
 * Tests for relationship-based choice requirements
 */

import { checkChoiceRequirements } from '../sceneTransitions';
import type { Choice } from '@/types';

describe('Relationship Requirements', () => {
  const baseState = {
    inventory: [],
    flags: [],
    relationships: {},
    evidence: [],
  };

  describe('Minimum Relationship Requirements', () => {
    it('should allow choice when relationship meets minimum', () => {
      const choice: Choice = {
        text: 'Ask Bastian for help',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 50 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should allow choice when relationship exceeds minimum', () => {
      const choice: Choice = {
        text: 'Ask Bastian for help',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 75 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should block choice when relationship is below minimum', () => {
      const choice: Choice = {
        text: 'Ask Bastian for help',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 30 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('bastian');
      expect(result.reason).toContain('≥ 50');
      expect(result.reason).toContain('30');
    });

    it('should treat missing relationship as 0', () => {
      const choice: Choice = {
        text: 'Ask Bastian for help',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 10,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: {}, // No relationship with bastian
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('0');
    });

    it('should check multiple relationship requirements', () => {
      const choice: Choice = {
        text: 'Form an alliance',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
            denis: 40,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 60, denis: 50 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should fail if any relationship requirement is not met', () => {
      const choice: Choice = {
        text: 'Form an alliance',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
            denis: 40,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 60, denis: 30 }, // Denis too low
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('denis');
    });
  });

  describe('Maximum Relationship Requirements', () => {
    it('should allow choice when relationship is at maximum', () => {
      const choice: Choice = {
        text: 'Betray Viktor',
        nextScene: 'A-1-001',
        requirements: {
          maxRelationships: {
            viktor: 0,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { viktor: 0 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should allow choice when relationship is below maximum', () => {
      const choice: Choice = {
        text: 'Betray Viktor',
        nextScene: 'A-1-001',
        requirements: {
          maxRelationships: {
            viktor: 0,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { viktor: -30 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should block choice when relationship exceeds maximum', () => {
      const choice: Choice = {
        text: 'Betray Viktor',
        nextScene: 'A-1-001',
        requirements: {
          maxRelationships: {
            viktor: 0,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { viktor: 20 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('viktor');
      expect(result.reason).toContain('≤ 0');
      expect(result.reason).toContain('20');
    });

    it('should check multiple maximum relationship requirements', () => {
      const choice: Choice = {
        text: 'Plot against the guards',
        nextScene: 'A-1-001',
        requirements: {
          maxRelationships: {
            officer_ramirez: 10,
            warden_vasquez: -20,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { officer_ramirez: 5, warden_vasquez: -30 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });
  });

  describe('Combined Min/Max Relationship Requirements', () => {
    it('should require relationship in specific range', () => {
      const choice: Choice = {
        text: 'Manipulate Marcel',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            marcel: 20, // Must be at least 20
          },
          maxRelationships: {
            marcel: 60, // But not more than 60
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { marcel: 40 }, // In range
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should block if below minimum even if below maximum', () => {
      const choice: Choice = {
        text: 'Manipulate Marcel',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            marcel: 20,
          },
          maxRelationships: {
            marcel: 60,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { marcel: 10 }, // Too low
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('≥ 20');
    });

    it('should block if above maximum even if above minimum', () => {
      const choice: Choice = {
        text: 'Manipulate Marcel',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            marcel: 20,
          },
          maxRelationships: {
            marcel: 60,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { marcel: 70 }, // Too high
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('≤ 60');
    });
  });

  describe('Relationship with Other Requirements', () => {
    it('should check relationships AND items', () => {
      const choice: Choice = {
        text: 'Use key to visit Bastian',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
          items: ['cell_key'],
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 60 },
        inventory: ['cell_key'],
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should fail if relationship met but item missing', () => {
      const choice: Choice = {
        text: 'Use key to visit Bastian',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
          items: ['cell_key'],
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 60 },
        inventory: [], // Missing key
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('cell_key');
    });

    it('should fail if item met but relationship too low', () => {
      const choice: Choice = {
        text: 'Use key to visit Bastian',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50,
          },
          items: ['cell_key'],
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 30 }, // Too low
        inventory: ['cell_key'],
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('bastian');
    });

    it('should check relationships AND flags', () => {
      const choice: Choice = {
        text: 'Recruit Bastian for escape',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 70,
          },
          flags: ['escape_plan_started'],
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 75 },
        flags: ['escape_plan_started'],
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });
  });

  describe('Negative Relationship Scores', () => {
    it('should work with negative minimum requirements', () => {
      const choice: Choice = {
        text: 'Threaten Émile',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            emile: -30, // Need at least -30 (can be higher/less negative)
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { emile: -20 }, // Higher than -30
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should block if relationship is too negative', () => {
      const choice: Choice = {
        text: 'Threaten Émile',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            emile: -30,
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { emile: -50 }, // Lower than -30
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(false);
      expect(result.reason).toContain('-30');
    });

    it('should work with negative maximum requirements', () => {
      const choice: Choice = {
        text: 'Stay hostile to Viktor',
        nextScene: 'A-1-001',
        requirements: {
          maxRelationships: {
            viktor: -10, // Must be -10 or lower (more negative)
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { viktor: -30 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should allow choice with no requirements', () => {
      const choice: Choice = {
        text: 'Continue',
        nextScene: 'A-1-001',
      };

      const result = checkChoiceRequirements(choice, baseState);
      expect(result.canSelect).toBe(true);
    });

    it('should handle empty relationships object', () => {
      const choice: Choice = {
        text: 'Continue',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {},
        },
      };

      const result = checkChoiceRequirements(choice, baseState);
      expect(result.canSelect).toBe(true);
    });

    it('should handle zero relationship requirement', () => {
      const choice: Choice = {
        text: 'Talk to Marcel neutrally',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            marcel: 0, // Exactly neutral or better
          },
        },
      };

      const state = {
        ...baseState,
        relationships: { marcel: 0 },
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });

    it('should handle multiple characters with mixed requirements', () => {
      const choice: Choice = {
        text: 'Complex alliance',
        nextScene: 'A-1-001',
        requirements: {
          relationships: {
            bastian: 50, // Friend with Bastian
          },
          maxRelationships: {
            viktor: -10, // Enemy with Viktor
          },
          items: ['guard_uniform'],
          flags: ['knows_secret'],
        },
      };

      const state = {
        ...baseState,
        relationships: { bastian: 60, viktor: -20 },
        inventory: ['guard_uniform'],
        flags: ['knows_secret'],
      };

      const result = checkChoiceRequirements(choice, state);
      expect(result.canSelect).toBe(true);
    });
  });
});
