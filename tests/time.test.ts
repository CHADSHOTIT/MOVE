import { describe, expect, it } from 'vitest';
import { cutoffDateTimeFor } from '../lib/time';

describe('cutoffDateTimeFor', () => {
  it('returns previous-day 18:00 Europe/London in UTC instant', () => {
    const cutoff = cutoffDateTimeFor('2026-07-14', '18:00');
    // BST in July = UTC+1, so 18:00 London is 17:00Z on previous day.
    expect(cutoff.toISOString()).toBe('2026-07-13T17:00:00.000Z');
  });
});
