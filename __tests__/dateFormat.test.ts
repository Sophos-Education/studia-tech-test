import { describe, it, expect } from 'vitest';
import {
  formatDateTime,
  formatTime,
  formatTimeRange,
  formatSessionDateTime,
} from '../src/utils/dateFormat';

describe('formatDateTime', () => {
  it.each([
    [new Date('2026-04-15T10:00:00'), 'Wed 15 Apr, 10:00'],
    [new Date('2026-12-25T14:45:00'), 'Fri 25 Dec, 14:45'],
    ['2026-01-01T09:15:00', 'Thu 1 Jan, 09:15'],
  ])('should format %s as %s', (input, expected) => {
    // Act
    const result = formatDateTime(input);

    // Assert
    expect(result).toBe(expected);
  });
});

describe('formatTime', () => {
  it.each([
    [new Date('2026-04-15T10:00:00'), '10:00'],
    [new Date('2026-04-15T11:30:00'), '11:30'],
    [new Date('2026-04-15T23:59:00'), '23:59'],
    ['2026-04-15T00:00:00', '00:00'],
  ])('should format %s as %s', (input, expected) => {
    // Act
    const result = formatTime(input);

    // Assert
    expect(result).toBe(expected);
  });
});

describe('formatTimeRange', () => {
  it.each([
    [
      new Date('2026-04-15T10:00:00'),
      new Date('2026-04-15T11:30:00'),
      '10:00 - 11:30',
    ],
    [
      new Date('2026-04-15T09:00:00'),
      new Date('2026-04-15T10:30:00'),
      '09:00 - 10:30',
    ],
    ['2026-04-15T14:00:00', '2026-04-15T15:00:00', '14:00 - 15:00'],
  ])('should format range from %s to %s as %s', (start, end, expected) => {
    // Act
    const result = formatTimeRange(start, end);

    // Assert
    expect(result).toBe(expected);
  });
});

describe('formatSessionDateTime', () => {
  it.each([
    [
      new Date('2026-04-15T10:00:00'),
      new Date('2026-04-15T11:30:00'),
      'Wed 15 Apr, 10:00 - 11:30',
    ],
    [
      new Date('2026-12-25T14:00:00'),
      new Date('2026-12-25T15:00:00'),
      'Fri 25 Dec, 14:00 - 15:00',
    ],
    ['2026-01-01T09:00:00', '2026-01-01T10:00:00', 'Thu 1 Jan, 09:00 - 10:00'],
  ])('should format session from %s to %s as %s', (start, end, expected) => {
    // Act
    const result = formatSessionDateTime(start, end);

    // Assert
    expect(result).toBe(expected);
  });
});
