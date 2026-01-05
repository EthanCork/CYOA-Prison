/**
 * Tests for stats utility functions
 */

import {
  formatNumber,
  formatPlayTime,
  getPathDisplayName,
  getPathIcon,
  getPathColor,
  getCompletionPercentage,
  getEngagementLevel,
  getCollectorRank,
  getRelationshipMastery,
  getStageDescription,
  calculateGameScore,
  getGameRank,
  getStatsSummary,
  checkMilestones,
  getAchievedMilestones,
  MILESTONE_INFO,
} from '../statsUtils';
import type { GameStats } from '@/types';

describe('Stats Utils', () => {
  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('formatPlayTime', () => {
    it('should format seconds', () => {
      expect(formatPlayTime(30)).toBe('30s');
      expect(formatPlayTime(59)).toBe('59s');
    });

    it('should format minutes', () => {
      expect(formatPlayTime(60)).toBe('1m');
      expect(formatPlayTime(120)).toBe('2m');
      expect(formatPlayTime(90)).toBe('1m 30s');
    });

    it('should format hours', () => {
      expect(formatPlayTime(3600)).toBe('1h');
      expect(formatPlayTime(7200)).toBe('2h');
      expect(formatPlayTime(3660)).toBe('1h 1m');
      expect(formatPlayTime(3720)).toBe('1h 2m');
    });

    it('should handle edge cases', () => {
      expect(formatPlayTime(0)).toBe('0s');
      expect(formatPlayTime(1)).toBe('1s');
    });
  });

  describe('getPathDisplayName', () => {
    it('should return correct names for all paths', () => {
      expect(getPathDisplayName('A')).toBe('Path A: Power');
      expect(getPathDisplayName('B')).toBe('Path B: Trust');
      expect(getPathDisplayName('C')).toBe('Path C: Justice');
    });
  });

  describe('getPathIcon', () => {
    it('should return correct icons for all paths', () => {
      expect(getPathIcon('A')).toBe('👑');
      expect(getPathIcon('B')).toBe('🤝');
      expect(getPathIcon('C')).toBe('⚖️');
    });
  });

  describe('getPathColor', () => {
    it('should return correct colors for all paths', () => {
      expect(getPathColor('A')).toBe('red');
      expect(getPathColor('B')).toBe('blue');
      expect(getPathColor('C')).toBe('green');
    });
  });

  describe('getCompletionPercentage', () => {
    it('should calculate percentage with default total', () => {
      expect(getCompletionPercentage(0)).toBe(0);
      expect(getCompletionPercentage(50)).toBe(50);
      expect(getCompletionPercentage(100)).toBe(100);
    });

    it('should calculate percentage with custom total', () => {
      expect(getCompletionPercentage(25, 50)).toBe(50);
      expect(getCompletionPercentage(10, 20)).toBe(50);
    });

    it('should cap at 100%', () => {
      expect(getCompletionPercentage(150)).toBe(100);
      expect(getCompletionPercentage(200, 50)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(getCompletionPercentage(33, 100)).toBe(33);
      expect(getCompletionPercentage(67, 100)).toBe(67);
    });
  });

  describe('getEngagementLevel', () => {
    it('should return Cautious for < 10 choices', () => {
      const result = getEngagementLevel(5);
      expect(result.level).toBe('Cautious');
      expect(result.color).toBe('gray');
    });

    it('should return Engaged for 10-29 choices', () => {
      const result = getEngagementLevel(20);
      expect(result.level).toBe('Engaged');
      expect(result.color).toBe('blue');
    });

    it('should return Invested for 30-59 choices', () => {
      const result = getEngagementLevel(45);
      expect(result.level).toBe('Invested');
      expect(result.color).toBe('purple');
    });

    it('should return Completionist for 60+ choices', () => {
      const result = getEngagementLevel(100);
      expect(result.level).toBe('Completionist');
      expect(result.color).toBe('amber');
    });
  });

  describe('getCollectorRank', () => {
    it('should return Minimalist for 0 items', () => {
      const result = getCollectorRank(0);
      expect(result.rank).toBe('Minimalist');
      expect(result.color).toBe('gray');
    });

    it('should return Novice Collector for 1-4 items', () => {
      const result = getCollectorRank(3);
      expect(result.rank).toBe('Novice Collector');
      expect(result.color).toBe('blue');
    });

    it('should return Skilled Collector for 5-9 items', () => {
      const result = getCollectorRank(7);
      expect(result.rank).toBe('Skilled Collector');
      expect(result.color).toBe('green');
    });

    it('should return Expert Collector for 10-19 items', () => {
      const result = getCollectorRank(15);
      expect(result.rank).toBe('Expert Collector');
      expect(result.color).toBe('purple');
    });

    it('should return Master Collector for 20+ items', () => {
      const result = getCollectorRank(25);
      expect(result.rank).toBe('Master Collector');
      expect(result.color).toBe('amber');
    });
  });

  describe('getRelationshipMastery', () => {
    it('should handle no relationships', () => {
      const result = getRelationshipMastery(0, 0);
      expect(result.description).toBe('Neutral with everyone');
      expect(result.color).toBe('gray');
    });

    it('should handle more allies than enemies', () => {
      const result = getRelationshipMastery(3, 1);
      expect(result.description).toBe('3 strong allies');
      expect(result.color).toBe('green');
    });

    it('should handle single ally', () => {
      const result = getRelationshipMastery(1, 0);
      expect(result.description).toBe('1 strong ally');
      expect(result.color).toBe('green');
    });

    it('should handle more enemies than allies', () => {
      const result = getRelationshipMastery(1, 3);
      expect(result.description).toBe('3 dangerous enemies');
      expect(result.color).toBe('red');
    });

    it('should handle single enemy', () => {
      const result = getRelationshipMastery(0, 1);
      expect(result.description).toBe('1 dangerous enemy');
      expect(result.color).toBe('red');
    });

    it('should handle equal allies and enemies', () => {
      const result = getRelationshipMastery(2, 2);
      expect(result.description).toBe('2 allies, 2 enemies');
      expect(result.color).toBe('purple');
    });
  });

  describe('getStageDescription', () => {
    it('should describe stage 0', () => {
      const result = getStageDescription(0);
      expect(result.description).toBe('Just beginning');
      expect(result.progress).toBe('Day 1');
    });

    it('should describe early stages (1-2)', () => {
      const result = getStageDescription(2);
      expect(result.description).toBe('Early days');
      expect(result.progress).toBe('Day 2');
    });

    it('should describe mid stages (3-4)', () => {
      const result = getStageDescription(4);
      expect(result.description).toBe('Making progress');
      expect(result.progress).toBe('Day 4');
    });

    it('should describe late stage (5)', () => {
      const result = getStageDescription(5);
      expect(result.description).toBe('Nearly there');
      expect(result.progress).toBe('Day 5');
    });

    it('should describe final stage (6+)', () => {
      const result = getStageDescription(6);
      expect(result.description).toBe('Reached the end');
      expect(result.progress).toBe('Day 6');
    });
  });

  describe('calculateGameScore', () => {
    it('should calculate score from stats', () => {
      const stats: GameStats = {
        scenesVisited: 10,
        choicesMade: 5,
        itemsFound: 3,
        relationshipsMaxed: 2,
        relationshipsMinned: 1,
        stageReached: 4,
        pathTaken: 'A',
        playTimeSeconds: 600,
      };

      // 10*1 + 5*2 + 3*3 + 2*5 + 1*3 + 4*10 = 10 + 10 + 9 + 10 + 3 + 40 = 82
      expect(calculateGameScore(stats)).toBe(82);
    });

    it('should handle zero stats', () => {
      const stats: GameStats = {
        scenesVisited: 0,
        choicesMade: 0,
        itemsFound: 0,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
      };

      expect(calculateGameScore(stats)).toBe(0);
    });

    it('should weight stageReached heavily', () => {
      const statsHighStage: GameStats = {
        scenesVisited: 10,
        choicesMade: 10,
        itemsFound: 2,
        relationshipsMaxed: 1,
        relationshipsMinned: 1,
        stageReached: 6,
        pathTaken: 'C',
      };

      // High stage should have significant impact (stageReached: 6 * 10 = 60)
      expect(calculateGameScore(statsHighStage)).toBeGreaterThan(50);
    });
  });

  describe('getGameRank', () => {
    it('should return Newcomer for low scores', () => {
      const result = getGameRank(30);
      expect(result.rank).toBe('Newcomer');
      expect(result.color).toBe('gray');
    });

    it('should return Survivor for 50-149', () => {
      const result = getGameRank(100);
      expect(result.rank).toBe('Survivor');
      expect(result.color).toBe('blue');
    });

    it('should return Strategist for 150-299', () => {
      const result = getGameRank(200);
      expect(result.rank).toBe('Strategist');
      expect(result.color).toBe('green');
    });

    it('should return Master Planner for 300-499', () => {
      const result = getGameRank(400);
      expect(result.rank).toBe('Master Planner');
      expect(result.color).toBe('purple');
    });

    it('should return Legend for 500+', () => {
      const result = getGameRank(600);
      expect(result.rank).toBe('Legend');
      expect(result.color).toBe('amber');
    });
  });

  describe('getStatsSummary', () => {
    it('should return complete summary', () => {
      const stats: GameStats = {
        scenesVisited: 50,
        choicesMade: 25,
        itemsFound: 8,
        relationshipsMaxed: 2,
        relationshipsMinned: 1,
        stageReached: 3,
        pathTaken: 'B',
        playTimeSeconds: 1800,
      };

      const summary = getStatsSummary(stats);

      expect(summary.completion).toBe(50);
      expect(summary.engagement.level).toBe('Engaged');
      expect(summary.collector.rank).toBe('Skilled Collector');
      expect(summary.relationships.description).toContain('2 strong allies');
      expect(summary.stage.progress).toBe('Day 3');
      expect(summary.score).toBeGreaterThan(0);
      expect(summary.rank.rank).toBeDefined();
    });
  });

  describe('checkMilestones', () => {
    it('should check all milestones correctly', () => {
      const stats: GameStats = {
        scenesVisited: 80,
        choicesMade: 100,
        itemsFound: 20,
        relationshipsMaxed: 3,
        relationshipsMinned: 3,
        stageReached: 6,
        pathTaken: 'A',
      };

      const milestones = checkMilestones(stats);

      expect(milestones.firstChoice).toBe(true);
      expect(milestones.tenChoices).toBe(true);
      expect(milestones.firstItem).toBe(true);
      expect(milestones.firstAlly).toBe(true);
      expect(milestones.firstEnemy).toBe(true);
      expect(milestones.reachedDay3).toBe(true);
      expect(milestones.reachedDay6).toBe(true);
      expect(milestones.completionist).toBe(true);
      expect(milestones.collector).toBe(true);
      expect(milestones.diplomat).toBe(true);
      expect(milestones.antagonist).toBe(true);
    });

    it('should handle stats with no milestones', () => {
      const stats: GameStats = {
        scenesVisited: 5,
        choicesMade: 0,
        itemsFound: 0,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
      };

      const milestones = checkMilestones(stats);

      expect(milestones.firstChoice).toBe(false);
      expect(milestones.tenChoices).toBe(false);
      expect(milestones.firstItem).toBe(false);
      expect(milestones.firstAlly).toBe(false);
      expect(milestones.firstEnemy).toBe(false);
      expect(milestones.reachedDay3).toBe(false);
      expect(milestones.reachedDay6).toBe(false);
      expect(milestones.completionist).toBe(false);
      expect(milestones.collector).toBe(false);
      expect(milestones.diplomat).toBe(false);
      expect(milestones.antagonist).toBe(false);
    });

    it('should handle partial milestone completion', () => {
      const stats: GameStats = {
        scenesVisited: 20,
        choicesMade: 15,
        itemsFound: 5,
        relationshipsMaxed: 1,
        relationshipsMinned: 0,
        stageReached: 2,
        pathTaken: 'C',
      };

      const milestones = checkMilestones(stats);

      expect(milestones.firstChoice).toBe(true);
      expect(milestones.tenChoices).toBe(true);
      expect(milestones.firstItem).toBe(true);
      expect(milestones.firstAlly).toBe(true);
      expect(milestones.firstEnemy).toBe(false);
      expect(milestones.reachedDay3).toBe(false);
      expect(milestones.reachedDay6).toBe(false);
      expect(milestones.completionist).toBe(false);
      expect(milestones.collector).toBe(false);
    });
  });

  describe('MILESTONE_INFO', () => {
    it('should have info for all milestones', () => {
      const milestoneKeys = [
        'firstChoice',
        'tenChoices',
        'firstItem',
        'firstAlly',
        'firstEnemy',
        'reachedDay3',
        'reachedDay6',
        'completionist',
        'collector',
        'diplomat',
        'antagonist',
      ];

      milestoneKeys.forEach((key) => {
        expect(MILESTONE_INFO).toHaveProperty(key);
        const info = MILESTONE_INFO[key as keyof typeof MILESTONE_INFO];
        expect(info).toHaveProperty('name');
        expect(info).toHaveProperty('description');
        expect(info).toHaveProperty('icon');
      });
    });
  });

  describe('getAchievedMilestones', () => {
    it('should return only achieved milestones', () => {
      const stats: GameStats = {
        scenesVisited: 10,
        choicesMade: 5,
        itemsFound: 1,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
      };

      const achieved = getAchievedMilestones(stats);

      expect(achieved.length).toBe(2); // firstChoice and firstItem
      expect(achieved.find((m) => m.id === 'firstChoice')).toBeDefined();
      expect(achieved.find((m) => m.id === 'firstItem')).toBeDefined();
    });

    it('should return empty array for no achievements', () => {
      const stats: GameStats = {
        scenesVisited: 0,
        choicesMade: 0,
        itemsFound: 0,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
      };

      const achieved = getAchievedMilestones(stats);
      expect(achieved.length).toBe(0);
    });

    it('should return all milestones for maxed stats', () => {
      const stats: GameStats = {
        scenesVisited: 100,
        choicesMade: 100,
        itemsFound: 20,
        relationshipsMaxed: 3,
        relationshipsMinned: 3,
        stageReached: 6,
        pathTaken: 'A',
      };

      const achieved = getAchievedMilestones(stats);
      expect(achieved.length).toBe(11); // All milestones
    });

    it('should include milestone info', () => {
      const stats: GameStats = {
        scenesVisited: 10,
        choicesMade: 1,
        itemsFound: 0,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
      };

      const achieved = getAchievedMilestones(stats);
      const firstChoice = achieved.find((m) => m.id === 'firstChoice');

      expect(firstChoice).toBeDefined();
      expect(firstChoice?.name).toBe('First Choice');
      expect(firstChoice?.icon).toBe('🎯');
      expect(firstChoice?.description).toContain('first decision');
    });
  });
});
