import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recomputeWeek } from '@/lib/allocation';
import { weekDates, weekStartFrom } from '@/lib/time';

function check(token: string | null) {
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

function isValidHHmm(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const token = form.get('token')?.toString() ?? null;
  if (!check(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cutoff = String(form.get('ownerCutoff') ?? '18:00');
  if (!isValidHHmm(cutoff)) {
    return NextResponse.json({ error: 'Invalid cutoff format, expected HH:mm' }, { status: 400 });
  }

  await prisma.setting.upsert({
    where: { key: 'owner_cutoff_hhmm' },
    update: { value: cutoff },
    create: { key: 'owner_cutoff_hhmm', value: cutoff },
  });

  await recomputeWeek(weekDates(weekStartFrom(new Date())));
  return NextResponse.redirect(new URL(`/admin?token=${token}`, req.url));
}
