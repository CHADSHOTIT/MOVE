import { NextResponse } from 'next/server';
import { MovementStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { recomputeAllocationForDate } from '@/lib/allocation';
import { isDayLocked } from '@/lib/time';

export async function POST(req: Request) {
  const form = await req.formData();
  const staffId = Number(form.get('staffId'));
  const dateISO = String(form.get('dateISO'));
  const status = String(form.get('status')) as MovementStatus;
  const noteText = String(form.get('noteText') ?? '');
  const name = String(form.get('name'));
  const week = String(form.get('week'));

  if (isDayLocked(dateISO)) {
    return NextResponse.redirect(new URL(`/week?name=${encodeURIComponent(name)}&week=${week}`, req.url));
  }

  await prisma.movement.upsert({
    where: { staffId_dateISO: { staffId, dateISO } },
    create: { staffId, dateISO, status, noteText: status === 'OTHER' ? noteText : null },
    update: { status, noteText: status === 'OTHER' ? noteText : null },
  });

  if (status === 'OFFICE') {
    await prisma.officeRequest.upsert({
      where: { staffId_dateISO: { staffId, dateISO } },
      create: { staffId, dateISO, requestedAt: new Date() },
      update: {},
    });
  } else {
    await prisma.officeRequest.deleteMany({ where: { staffId, dateISO } });
  }

  await recomputeAllocationForDate(dateISO);

  return NextResponse.redirect(new URL(`/week?name=${encodeURIComponent(name)}&week=${week}`, req.url));
}
