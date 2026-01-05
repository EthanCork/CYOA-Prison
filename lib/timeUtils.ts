/**
 * Time tracking utility functions for Path C (Day/Justice)
 * Manages the 6-day timeline with 4 time periods per day
 */

import type { TimeOfDay, DayTime } from '@/types';

/**
 * Total number of days in Path C
 */
export const MAX_DAYS = 6;

/**
 * All time periods in order
 */
export const TIME_PERIODS: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];

/**
 * Time period information
 */
export interface TimePeriodInfo {
  id: TimeOfDay;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Get information about a specific time period
 */
export function getTimePeriodInfo(timeOfDay: TimeOfDay): TimePeriodInfo {
  const periods: Record<TimeOfDay, TimePeriodInfo> = {
    morning: {
      id: 'morning',
      name: 'Morning',
      description: 'Early morning hours, prisoners begin their daily routines',
      icon: '🌅',
      color: 'orange',
    },
    day: {
      id: 'day',
      name: 'Day',
      description: 'Midday, when most activities and investigations occur',
      icon: '☀️',
      color: 'yellow',
    },
    evening: {
      id: 'evening',
      name: 'Evening',
      description: 'Late afternoon, winding down for the night',
      icon: '🌆',
      color: 'purple',
    },
    night: {
      id: 'night',
      name: 'Night',
      description: 'Nighttime, lockdown in effect',
      icon: '🌙',
      color: 'blue',
    },
  };

  return periods[timeOfDay];
}

/**
 * Get Tailwind color classes for a time period
 */
export function getTimePeriodColors(timeOfDay: TimeOfDay): {
  bg: string;
  text: string;
  border: string;
  hover: string;
} {
  const colors: Record<TimeOfDay, ReturnType<typeof getTimePeriodColors>> = {
    morning: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-600',
      hover: 'hover:bg-orange-200',
    },
    day: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-600',
      hover: 'hover:bg-yellow-200',
    },
    evening: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-600',
      hover: 'hover:bg-purple-200',
    },
    night: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-600',
      hover: 'hover:bg-blue-200',
    },
  };

  return colors[timeOfDay];
}

/**
 * Get display name for day and time
 */
export function getDayTimeDisplayName(dayTime: DayTime | null): string {
  if (!dayTime) return 'Time not set';
  const info = getTimePeriodInfo(dayTime.timeOfDay);
  return `Day ${dayTime.day}, ${info.icon} ${info.name}`;
}

/**
 * Advance time to the next period
 * Returns new DayTime or null if we've reached the end
 */
export function advanceTime(currentTime: DayTime): DayTime | null {
  const currentIndex = TIME_PERIODS.indexOf(currentTime.timeOfDay);

  // If not at last period of day, advance to next period
  if (currentIndex < TIME_PERIODS.length - 1) {
    return {
      day: currentTime.day,
      timeOfDay: TIME_PERIODS[currentIndex + 1],
    };
  }

  // At night (last period), advance to next day's morning
  if (currentTime.day < MAX_DAYS) {
    return {
      day: currentTime.day + 1,
      timeOfDay: 'morning',
    };
  }

  // Reached end of Day 6 night
  return null;
}

/**
 * Set time to a specific day and period
 */
export function setTime(day: number, timeOfDay: TimeOfDay): DayTime | null {
  if (day < 1 || day > MAX_DAYS) {
    return null;
  }

  return { day, timeOfDay };
}

/**
 * Check if a specific time is valid
 */
export function isValidTime(dayTime: DayTime | null): boolean {
  if (!dayTime) return false;
  return (
    dayTime.day >= 1 &&
    dayTime.day <= MAX_DAYS &&
    TIME_PERIODS.includes(dayTime.timeOfDay)
  );
}

/**
 * Compare two times
 * Returns: -1 if time1 is before time2, 0 if equal, 1 if time1 is after time2
 */
export function compareTimes(time1: DayTime, time2: DayTime): number {
  if (time1.day !== time2.day) {
    return time1.day - time2.day;
  }

  const index1 = TIME_PERIODS.indexOf(time1.timeOfDay);
  const index2 = TIME_PERIODS.indexOf(time2.timeOfDay);
  return index1 - index2;
}

/**
 * Check if time1 is before time2
 */
export function isBefore(time1: DayTime, time2: DayTime): boolean {
  return compareTimes(time1, time2) < 0;
}

/**
 * Check if time1 is after time2
 */
export function isAfter(time1: DayTime, time2: DayTime): boolean {
  return compareTimes(time1, time2) > 0;
}

/**
 * Check if two times are equal
 */
export function isEqual(time1: DayTime, time2: DayTime): boolean {
  return time1.day === time2.day && time1.timeOfDay === time2.timeOfDay;
}

/**
 * Get the starting time for Path C
 */
export function getPathCStartTime(): DayTime {
  return { day: 1, timeOfDay: 'morning' };
}

/**
 * Calculate progress through Path C (0-100%)
 */
export function calculateTimeProgress(dayTime: DayTime): number {
  const totalPeriods = MAX_DAYS * TIME_PERIODS.length;
  const currentPeriodIndex = TIME_PERIODS.indexOf(dayTime.timeOfDay);
  const periodsElapsed = (dayTime.day - 1) * TIME_PERIODS.length + currentPeriodIndex;
  return Math.round((periodsElapsed / totalPeriods) * 100);
}

/**
 * Get remaining days
 */
export function getRemainingDays(dayTime: DayTime): number {
  return MAX_DAYS - dayTime.day;
}

/**
 * Check if it's the final day
 */
export function isFinalDay(dayTime: DayTime): boolean {
  return dayTime.day === MAX_DAYS;
}

/**
 * Check if a specific time period matches current time
 */
export function isTimeOfDay(current: DayTime, targetTime: TimeOfDay): boolean {
  return current.timeOfDay === targetTime;
}

/**
 * Check if current time is within a range
 */
export function isTimeBetween(
  current: DayTime,
  start: DayTime,
  end: DayTime
): boolean {
  return !isBefore(current, start) && !isAfter(current, end);
}

/**
 * Format day and time for display
 */
export function formatDayTime(dayTime: DayTime): string {
  return `Day ${dayTime.day}, ${dayTime.timeOfDay}`;
}

/**
 * Get all time periods as array
 */
export function getAllTimePeriods(): TimePeriodInfo[] {
  return TIME_PERIODS.map((period) => getTimePeriodInfo(period));
}
