import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { weekDates, weekStartFrom } from '@/lib/time';
import { recomputeWeek } from '@/lib/allocation';

function check(token: string | null) {
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

async function recomputeCurrentWeek() {
  await recomputeWeek(weekDates(weekStartFrom(new Date())));
}

export async function POST(req: Request) {
  const form = await req.formData();
  const token = form.get('token')?.toString() ?? null;
  if (!check(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const action = String(form.get('actionType') ?? 'create');

  if (action === 'delete') {
    const id = Number(form.get('staffId'));
    await prisma.staff.delete({ where: { id } });
    await recomputeCurrentWeek();
    return NextResponse.redirect(new URL(`/admin?token=${token}`, req.url));
  }

  if (action === 'update') {
    const id = Number(form.get('staffId'));
    const name = String(form.get('name'));
    const isOwner = form.get('isOwner') === 'on';
    const ownerBayNumberRaw = form.get('ownerBayNumber')?.toString()?.trim();
    const ownerBayNumber = isOwner && ownerBayNumberRaw ? Number(ownerBayNumberRaw) : null;
    const active = form.get('active') === 'on';

    await prisma.staff.update({
      where: { id },
      data: { name, isOwner, ownerBayNumber, active },
    });

    await recomputeCurrentWeek();
    return NextResponse.redirect(new URL(`/admin?token=${token}`, req.url));
  }

  const name = String(form.get('name'));
  const isOwner = form.get('isOwner') === 'on';
  const ownerBayNumberRaw = form.get('ownerBayNumber')?.toString()?.trim();
  const ownerBayNumber = isOwner && ownerBayNumberRaw ? Number(ownerBayNumberRaw) : null;

  await prisma.staff.create({ data: { name, isOwner, ownerBayNumber } });
  await recomputeCurrentWeek();

  return NextResponse.redirect(new URL(`/admin?token=${token}`, req.url));
}
