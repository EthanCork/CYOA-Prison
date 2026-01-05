/**
 * Tests for time tracking utility functions
 */

import {
  getTimePeriodInfo,
  getTimePeriodColors,
  getDayTimeDisplayName,
  advanceTime,
  setTime,
  isValidTime,
  compareTimes,
  isBefore,
  isAfter,
  isEqual,
  getPathCStartTime,
  calculateTimeProgress,
  getRemainingDays,
  isFinalDay,
  isTimeOfDay,
  isTimeBetween,
  formatDayTime,
  getAllTimePeriods,
  MAX_DAYS,
  TIME_PERIODS,
} from '../timeUtils';
import type { DayTime } from '@/types';

describe('Time Utils', () => {
  describe('getTimePeriodInfo', () => {
    it('should return info for morning', () => {
      const info = getTimePeriodInfo('morning');
      expect(info.id).toBe('morning');
      expect(info.name).toBe('Morning');
      expect(info.icon).toBe('🌅');
      expect(info.color).toBe('orange');
      expect(info.description).toContain('morning');
    });

    it('should return info for day', () => {
      const info = getTimePeriodInfo('day');
      expect(info.id).toBe('day');
      expect(info.name).toBe('Day');
      expect(info.icon).toBe('☀️');
      expect(info.color).toBe('yellow');
    });

    it('should return info for evening', () => {
      const info = getTimePeriodInfo('evening');
      expect(info.id).toBe('evening');
      expect(info.name).toBe('Evening');
      expect(info.icon).toBe('🌆');
      expect(info.color).toBe('purple');
    });

    it('should return info for night', () => {
      const info = getTimePeriodInfo('night');
      expect(info.id).toBe('night');
      expect(info.name).toBe('Night');
      expect(info.icon).toBe('🌙');
      expect(info.color).toBe('blue');
    });

    it('should have all required fields', () => {
      const info = getTimePeriodInfo('morning');
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('icon');
      expect(info).toHaveProperty('color');
    });
  });

  describe('getTimePeriodColors', () => {
    it('should return orange colors for morning', () => {
      const colors = getTimePeriodColors('morning');
      expect(colors.bg).toBe('bg-orange-100');
      expect(colors.text).toBe('text-orange-800');
      expect(colors.border).toBe('border-orange-600');
      expect(colors.hover).toBe('hover:bg-orange-200');
    });

    it('should return yellow colors for day', () => {
      const colors = getTimePeriodColors('day');
      expect(colors.bg).toContain('yellow');
    });

    it('should return purple colors for evening', () => {
      const colors = getTimePeriodColors('evening');
      expect(colors.bg).toContain('purple');
    });

    it('should return blue colors for night', () => {
      const colors = getTimePeriodColors('night');
      expect(colors.bg).toContain('blue');
    });
  });

  describe('getDayTimeDisplayName', () => {
    it('should format day 1 morning', () => {
      const name = getDayTimeDisplayName({ day: 1, timeOfDay: 'morning' });
      expect(name).toBe('Day 1, 🌅 Morning');
    });

    it('should format day 3 evening', () => {
      const name = getDayTimeDisplayName({ day: 3, timeOfDay: 'evening' });
      expect(name).toBe('Day 3, 🌆 Evening');
    });

    it('should return placeholder for null', () => {
      const name = getDayTimeDisplayName(null);
      expect(name).toBe('Time not set');
    });
  });

  describe('advanceTime', () => {
    it('should advance from morning to day', () => {
      const current: DayTime = { day: 1, timeOfDay: 'morning' };
      const next = advanceTime(current);
      expect(next).toEqual({ day: 1, timeOfDay: 'day' });
    });

    it('should advance from day to evening', () => {
      const current: DayTime = { day: 2, timeOfDay: 'day' };
      const next = advanceTime(current);
      expect(next).toEqual({ day: 2, timeOfDay: 'evening' });
    });

    it('should advance from evening to night', () => {
      const current: DayTime = { day: 3, timeOfDay: 'evening' };
      const next = advanceTime(current);
      expect(next).toEqual({ day: 3, timeOfDay: 'night' });
    });

    it('should advance from night to next day morning', () => {
      const current: DayTime = { day: 1, timeOfDay: 'night' };
      const next = advanceTime(current);
      expect(next).toEqual({ day: 2, timeOfDay: 'morning' });
    });

    it('should return null at end of day 6 night', () => {
      const current: DayTime = { day: 6, timeOfDay: 'night' };
      const next = advanceTime(current);
      expect(next).toBeNull();
    });

    it('should handle mid-game progression', () => {
      let time: DayTime | null = { day: 4, timeOfDay: 'evening' };
      time = advanceTime(time!);
      expect(time).toEqual({ day: 4, timeOfDay: 'night' });
      time = advanceTime(time!);
      expect(time).toEqual({ day: 5, timeOfDay: 'morning' });
    });
  });

  describe('setTime', () => {
    it('should set valid time', () => {
      const time = setTime(3, 'day');
      expect(time).toEqual({ day: 3, timeOfDay: 'day' });
    });

    it('should return null for day < 1', () => {
      const time = setTime(0, 'morning');
      expect(time).toBeNull();
    });

    it('should return null for day > 6', () => {
      const time = setTime(7, 'morning');
      expect(time).toBeNull();
    });

    it('should accept day 1', () => {
      const time = setTime(1, 'morning');
      expect(time).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should accept day 6', () => {
      const time = setTime(6, 'night');
      expect(time).toEqual({ day: 6, timeOfDay: 'night' });
    });
  });

  describe('isValidTime', () => {
    it('should return true for valid times', () => {
      expect(isValidTime({ day: 1, timeOfDay: 'morning' })).toBe(true);
      expect(isValidTime({ day: 6, timeOfDay: 'night' })).toBe(true);
      expect(isValidTime({ day: 3, timeOfDay: 'day' })).toBe(true);
    });

    it('should return false for invalid day', () => {
      expect(isValidTime({ day: 0, timeOfDay: 'morning' })).toBe(false);
      expect(isValidTime({ day: 7, timeOfDay: 'morning' })).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidTime(null)).toBe(false);
    });
  });

  describe('compareTimes', () => {
    it('should return -1 when time1 is before time2', () => {
      const time1: DayTime = { day: 1, timeOfDay: 'morning' };
      const time2: DayTime = { day: 1, timeOfDay: 'day' };
      expect(compareTimes(time1, time2)).toBe(-1);
    });

    it('should return positive when time1 is after time2', () => {
      const time1: DayTime = { day: 2, timeOfDay: 'night' };
      const time2: DayTime = { day: 2, timeOfDay: 'morning' };
      expect(compareTimes(time1, time2)).toBeGreaterThan(0);
    });

    it('should return 0 when times are equal', () => {
      const time1: DayTime = { day: 3, timeOfDay: 'evening' };
      const time2: DayTime = { day: 3, timeOfDay: 'evening' };
      expect(compareTimes(time1, time2)).toBe(0);
    });

    it('should compare different days correctly', () => {
      const time1: DayTime = { day: 1, timeOfDay: 'night' };
      const time2: DayTime = { day: 2, timeOfDay: 'morning' };
      expect(compareTimes(time1, time2)).toBe(-1);
    });
  });

  describe('isBefore', () => {
    it('should return true when time1 is before time2', () => {
      expect(isBefore({ day: 1, timeOfDay: 'morning' }, { day: 1, timeOfDay: 'day' })).toBe(true);
      expect(isBefore({ day: 1, timeOfDay: 'night' }, { day: 2, timeOfDay: 'morning' })).toBe(true);
    });

    it('should return false when times are equal or after', () => {
      expect(isBefore({ day: 2, timeOfDay: 'day' }, { day: 2, timeOfDay: 'day' })).toBe(false);
      expect(isBefore({ day: 3, timeOfDay: 'night' }, { day: 3, timeOfDay: 'morning' })).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('should return true when time1 is after time2', () => {
      expect(isAfter({ day: 2, timeOfDay: 'day' }, { day: 1, timeOfDay: 'night' })).toBe(true);
      expect(isAfter({ day: 3, timeOfDay: 'evening' }, { day: 3, timeOfDay: 'morning' })).toBe(true);
    });

    it('should return false when times are equal or before', () => {
      expect(isAfter({ day: 1, timeOfDay: 'morning' }, { day: 1, timeOfDay: 'morning' })).toBe(false);
      expect(isAfter({ day: 1, timeOfDay: 'day' }, { day: 2, timeOfDay: 'morning' })).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should return true for equal times', () => {
      expect(isEqual({ day: 2, timeOfDay: 'evening' }, { day: 2, timeOfDay: 'evening' })).toBe(true);
    });

    it('should return false for different times', () => {
      expect(isEqual({ day: 1, timeOfDay: 'morning' }, { day: 1, timeOfDay: 'day' })).toBe(false);
      expect(isEqual({ day: 1, timeOfDay: 'morning' }, { day: 2, timeOfDay: 'morning' })).toBe(false);
    });
  });

  describe('getPathCStartTime', () => {
    it('should return day 1 morning', () => {
      const start = getPathCStartTime();
      expect(start).toEqual({ day: 1, timeOfDay: 'morning' });
    });
  });

  describe('calculateTimeProgress', () => {
    it('should return 0% at start', () => {
      const progress = calculateTimeProgress({ day: 1, timeOfDay: 'morning' });
      expect(progress).toBe(0);
    });

    it('should return ~40% at day 3 day period', () => {
      // Day 1: 0-3, Day 2: 4-7, Day 3 day is index 9 (day periods start at 1)
      // 9 / 24 = 37.5% rounded to 38%
      const progress = calculateTimeProgress({ day: 3, timeOfDay: 'day' });
      expect(progress).toBe(38);
    });

    it('should return high percentage near end', () => {
      const progress = calculateTimeProgress({ day: 6, timeOfDay: 'night' });
      expect(progress).toBeGreaterThanOrEqual(95);
    });

    it('should calculate correctly for day 2 morning', () => {
      // Day 1 has 4 periods (0-3), day 2 morning is index 4
      // 4 / 24 = 16.67%
      const progress = calculateTimeProgress({ day: 2, timeOfDay: 'morning' });
      expect(progress).toBe(17); // Rounded
    });
  });

  describe('getRemainingDays', () => {
    it('should return 5 days on day 1', () => {
      expect(getRemainingDays({ day: 1, timeOfDay: 'morning' })).toBe(5);
    });

    it('should return 0 days on day 6', () => {
      expect(getRemainingDays({ day: 6, timeOfDay: 'night' })).toBe(0);
    });

    it('should return 3 days on day 3', () => {
      expect(getRemainingDays({ day: 3, timeOfDay: 'evening' })).toBe(3);
    });
  });

  describe('isFinalDay', () => {
    it('should return false for days 1-5', () => {
      expect(isFinalDay({ day: 1, timeOfDay: 'morning' })).toBe(false);
      expect(isFinalDay({ day: 5, timeOfDay: 'night' })).toBe(false);
    });

    it('should return true for day 6', () => {
      expect(isFinalDay({ day: 6, timeOfDay: 'morning' })).toBe(true);
      expect(isFinalDay({ day: 6, timeOfDay: 'night' })).toBe(true);
    });
  });

  describe('isTimeOfDay', () => {
    it('should return true for matching time of day', () => {
      expect(isTimeOfDay({ day: 2, timeOfDay: 'morning' }, 'morning')).toBe(true);
      expect(isTimeOfDay({ day: 5, timeOfDay: 'night' }, 'night')).toBe(true);
    });

    it('should return false for non-matching time of day', () => {
      expect(isTimeOfDay({ day: 2, timeOfDay: 'morning' }, 'night')).toBe(false);
      expect(isTimeOfDay({ day: 3, timeOfDay: 'day' }, 'evening')).toBe(false);
    });
  });

  describe('isTimeBetween', () => {
    it('should return true when time is within range', () => {
      const current: DayTime = { day: 2, timeOfDay: 'day' };
      const start: DayTime = { day: 2, timeOfDay: 'morning' };
      const end: DayTime = { day: 2, timeOfDay: 'evening' };
      expect(isTimeBetween(current, start, end)).toBe(true);
    });

    it('should return true when time equals start', () => {
      const current: DayTime = { day: 1, timeOfDay: 'morning' };
      const start: DayTime = { day: 1, timeOfDay: 'morning' };
      const end: DayTime = { day: 1, timeOfDay: 'night' };
      expect(isTimeBetween(current, start, end)).toBe(true);
    });

    it('should return true when time equals end', () => {
      const current: DayTime = { day: 3, timeOfDay: 'night' };
      const start: DayTime = { day: 3, timeOfDay: 'morning' };
      const end: DayTime = { day: 3, timeOfDay: 'night' };
      expect(isTimeBetween(current, start, end)).toBe(true);
    });

    it('should return false when time is before range', () => {
      const current: DayTime = { day: 1, timeOfDay: 'morning' };
      const start: DayTime = { day: 2, timeOfDay: 'morning' };
      const end: DayTime = { day: 3, timeOfDay: 'morning' };
      expect(isTimeBetween(current, start, end)).toBe(false);
    });

    it('should return false when time is after range', () => {
      const current: DayTime = { day: 5, timeOfDay: 'night' };
      const start: DayTime = { day: 2, timeOfDay: 'day' };
      const end: DayTime = { day: 4, timeOfDay: 'evening' };
      expect(isTimeBetween(current, start, end)).toBe(false);
    });
  });

  describe('formatDayTime', () => {
    it('should format time correctly', () => {
      expect(formatDayTime({ day: 1, timeOfDay: 'morning' })).toBe('Day 1, morning');
      expect(formatDayTime({ day: 6, timeOfDay: 'night' })).toBe('Day 6, night');
    });
  });

  describe('getAllTimePeriods', () => {
    it('should return all 4 time periods', () => {
      const periods = getAllTimePeriods();
      expect(periods).toHaveLength(4);
    });

    it('should return periods in order', () => {
      const periods = getAllTimePeriods();
      expect(periods[0].id).toBe('morning');
      expect(periods[1].id).toBe('day');
      expect(periods[2].id).toBe('evening');
      expect(periods[3].id).toBe('night');
    });

    it('should return complete period info', () => {
      const periods = getAllTimePeriods();
      periods.forEach((period) => {
        expect(period).toHaveProperty('id');
        expect(period).toHaveProperty('name');
        expect(period).toHaveProperty('description');
        expect(period).toHaveProperty('icon');
        expect(period).toHaveProperty('color');
      });
    });
  });

  describe('Constants', () => {
    it('should have MAX_DAYS = 6', () => {
      expect(MAX_DAYS).toBe(6);
    });

    it('should have 4 TIME_PERIODS', () => {
      expect(TIME_PERIODS).toHaveLength(4);
      expect(TIME_PERIODS).toEqual(['morning', 'day', 'evening', 'night']);
    });
  });

  describe('Full Day Progression', () => {
    it('should advance through all periods of a day', () => {
      let time: DayTime | null = { day: 2, timeOfDay: 'morning' };

      time = advanceTime(time!);
      expect(time).toEqual({ day: 2, timeOfDay: 'day' });

      time = advanceTime(time!);
      expect(time).toEqual({ day: 2, timeOfDay: 'evening' });

      time = advanceTime(time!);
      expect(time).toEqual({ day: 2, timeOfDay: 'night' });

      time = advanceTime(time!);
      expect(time).toEqual({ day: 3, timeOfDay: 'morning' });
    });

    it('should progress through entire Path C timeline', () => {
      let time: DayTime | null = getPathCStartTime();
      let iterations = 0;
      const maxIterations = 24; // 6 days × 4 periods

      while (time && iterations < maxIterations) {
        expect(isValidTime(time)).toBe(true);
        time = advanceTime(time);
        iterations++;
      }

      expect(iterations).toBe(24);
      expect(time).toBeNull(); // Should be null after day 6 night
    });
  });
});
