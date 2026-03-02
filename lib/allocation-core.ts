export type StaffLite = {
  id: number;
  isOwner: boolean;
  ownerBayNumber: number | null;
  active: boolean;
};

export type MovementLite = {
  staffId: number;
  status: 'OFFICE' | 'LONDON' | 'TELFORD' | 'FRANCE' | 'TRAINING' | 'WFH' | 'OTHER';
};

export type OfficeRequestLite = {
  staffId: number;
  requestedAt: Date;
  id: number;
};

export type AllocationResult = {
  ownerAssignments: Array<{ bayNumber: number; staffId: number }>;
  tempAssignments: Array<{ bayNumber: number; staffId: number }>;
  unassignedOfficeStaffIds: number[];
};

export function computeAllocations(params: {
  staff: StaffLite[];
  movements: MovementLite[];
  officeRequests: OfficeRequestLite[];
  now: Date;
  cutoff: Date;
}): AllocationResult {
  const { staff, movements, officeRequests, now, cutoff } = params;
  const moveMap = new Map(movements.map((m) => [m.staffId, m]));

  const owners = staff.filter((s) => s.active && s.isOwner && s.ownerBayNumber != null);
  const nonOwners = staff.filter((s) => s.active && !s.isOwner);

  const ownerAssignments: Array<{ bayNumber: number; staffId: number }> = [];
  const availableBays: number[] = [];

  for (const owner of owners) {
    const move = moveMap.get(owner.id);
    if (move?.status === 'OFFICE') {
      ownerAssignments.push({ bayNumber: owner.ownerBayNumber!, staffId: owner.id });
      continue;
    }

    const isMissingBeforeCutoff = !move && now < cutoff;
    if (!isMissingBeforeCutoff) {
      availableBays.push(owner.ownerBayNumber!);
    }
  }

  availableBays.sort((a, b) => a - b);

  const nonOwnerOfficeSet = new Set(
    nonOwners
      .filter((s) => moveMap.get(s.id)?.status === 'OFFICE')
      .map((s) => s.id),
  );

  const sortedRequests = officeRequests
    .filter((r) => nonOwnerOfficeSet.has(r.staffId))
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime() || a.id - b.id);

  const tempAssignments = sortedRequests.slice(0, availableBays.length).map((r, idx) => ({
    bayNumber: availableBays[idx],
    staffId: r.staffId,
  }));

  const assignedSet = new Set(tempAssignments.map((a) => a.staffId));
  const unassignedOfficeStaffIds = sortedRequests.filter((r) => !assignedSet.has(r.staffId)).map((r) => r.staffId);

  return { ownerAssignments, tempAssignments, unassignedOfficeStaffIds };
}
