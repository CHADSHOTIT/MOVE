import { MovementStatus } from '@prisma/client';
import { prisma } from './prisma';

export const statusOptions: MovementStatus[] = [
  'OFFICE',
  'LONDON',
  'TELFORD',
  'FRANCE',
  'TRAINING',
  'WFH',
  'OTHER',
];

export async function getWeekData(weekDates: string[], staffId: number) {
  const [movements, assignments, requests] = await Promise.all([
    prisma.movement.findMany({ where: { dateISO: { in: weekDates }, staffId } }),
    prisma.bayAssignment.findMany({ where: { dateISO: { in: weekDates } } }),
    prisma.officeRequest.findMany({ where: { dateISO: { in: weekDates }, staffId } }),
  ]);

  const movementMap = new Map(movements.map((m) => [m.dateISO, m]));
  const assignMap = new Map(assignments.map((a) => [`${a.dateISO}:${a.assignedToStaffId}`, a]));
  const reqMap = new Map(requests.map((r) => [r.dateISO, r]));

  return weekDates.map((dateISO) => ({
    dateISO,
    movement: movementMap.get(dateISO),
    assignment: assignMap.get(`${dateISO}:${staffId}`),
    request: reqMap.get(dateISO),
  }));
}
