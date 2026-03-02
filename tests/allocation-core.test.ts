import { describe, expect, it } from 'vitest';
import { computeAllocations } from '../lib/allocation-core';

const baseStaff = [
  { id: 1, isOwner: true, ownerBayNumber: 1, active: true },
  { id: 2, isOwner: true, ownerBayNumber: 2, active: true },
  { id: 3, isOwner: false, ownerBayNumber: null, active: true },
  { id: 4, isOwner: false, ownerBayNumber: null, active: true },
];

describe('computeAllocations', () => {
  it('releases owner bay when owner is not OFFICE', () => {
    const result = computeAllocations({
      staff: baseStaff,
      movements: [
        { staffId: 1, status: 'WFH' },
        { staffId: 2, status: 'OFFICE' },
        { staffId: 3, status: 'OFFICE' },
      ],
      officeRequests: [{ staffId: 3, requestedAt: new Date('2026-01-01T09:00:00Z'), id: 1 }],
      now: new Date('2026-01-01T10:00:00Z'),
      cutoff: new Date('2026-01-01T08:00:00Z'),
    });

    expect(result.ownerAssignments).toEqual([{ bayNumber: 2, staffId: 2 }]);
    expect(result.tempAssignments).toEqual([{ bayNumber: 1, staffId: 3 }]);
  });

  it('assigns non-owners first-come-first-served by requestedAt', () => {
    const result = computeAllocations({
      staff: baseStaff,
      movements: [
        { staffId: 1, status: 'WFH' },
        { staffId: 2, status: 'WFH' },
        { staffId: 3, status: 'OFFICE' },
        { staffId: 4, status: 'OFFICE' },
      ],
      officeRequests: [
        { staffId: 4, requestedAt: new Date('2026-01-01T10:00:00Z'), id: 2 },
        { staffId: 3, requestedAt: new Date('2026-01-01T09:00:00Z'), id: 1 },
      ],
      now: new Date('2026-01-01T11:00:00Z'),
      cutoff: new Date('2026-01-01T08:00:00Z'),
    });

    expect(result.tempAssignments).toEqual([
      { bayNumber: 1, staffId: 3 },
      { bayNumber: 2, staffId: 4 },
    ]);
  });

  it('keeps missing owner bay reserved before cutoff and releases after cutoff', () => {
    const beforeCutoff = computeAllocations({
      staff: baseStaff,
      movements: [{ staffId: 3, status: 'OFFICE' }],
      officeRequests: [{ staffId: 3, requestedAt: new Date('2026-01-01T09:00:00Z'), id: 1 }],
      now: new Date('2026-01-01T16:00:00Z'),
      cutoff: new Date('2026-01-01T18:00:00Z'),
    });

    expect(beforeCutoff.tempAssignments).toEqual([]);

    const afterCutoff = computeAllocations({
      staff: baseStaff,
      movements: [{ staffId: 3, status: 'OFFICE' }],
      officeRequests: [{ staffId: 3, requestedAt: new Date('2026-01-01T09:00:00Z'), id: 1 }],
      now: new Date('2026-01-01T19:00:00Z'),
      cutoff: new Date('2026-01-01T18:00:00Z'),
    });

    expect(afterCutoff.tempAssignments).toEqual([{ bayNumber: 1, staffId: 3 }]);
  });
});
