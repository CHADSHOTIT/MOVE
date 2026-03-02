import { AssignmentType, MovementStatus } from '@prisma/client';
import { prisma } from './prisma';
import { computeAllocations } from './allocation-core';
import { cutoffDateTimeFor } from './time';

export async function getCutoffSetting() {
  const cutoff = await prisma.setting.findUnique({ where: { key: 'owner_cutoff_hhmm' } });
  return cutoff?.value ?? '18:00';
}

export async function recomputeAllocationForDate(dateISO: string) {
  const cutoffHHmm = await getCutoffSetting();
  const cutoff = cutoffDateTimeFor(dateISO, cutoffHHmm);
  const now = new Date();

  const [staff, movements, requests] = await Promise.all([
    prisma.staff.findMany({ where: { active: true } }),
    prisma.movement.findMany({ where: { dateISO } }),
    prisma.officeRequest.findMany({ where: { dateISO } }),
  ]);

  const result = computeAllocations({
    staff: staff.map((s) => ({ id: s.id, isOwner: s.isOwner, ownerBayNumber: s.ownerBayNumber, active: s.active })),
    movements: movements.map((m) => ({ staffId: m.staffId, status: m.status as MovementStatus })),
    officeRequests: requests.map((r) => ({ staffId: r.staffId, requestedAt: r.requestedAt, id: r.id })),
    now,
    cutoff,
  });

  await prisma.$transaction([
    prisma.bayAssignment.deleteMany({ where: { dateISO } }),
    prisma.bayAssignment.createMany({
      data: [
        ...result.ownerAssignments.map((a) => ({
          dateISO,
          bayNumber: a.bayNumber,
          assignedToStaffId: a.staffId,
          assignmentType: AssignmentType.OWNER,
          assignedAt: now,
        })),
        ...result.tempAssignments.map((a) => ({
          dateISO,
          bayNumber: a.bayNumber,
          assignedToStaffId: a.staffId,
          assignmentType: AssignmentType.TEMP,
          assignedAt: now,
        })),
      ],
    }),
    prisma.allocationMeta.upsert({
      where: { dateISO },
      create: { dateISO, lastComputedAt: now },
      update: { lastComputedAt: now },
    }),
  ]);
}

export async function recomputeWeek(weekDatesISO: string[]) {
  for (const d of weekDatesISO) await recomputeAllocationForDate(d);
}
