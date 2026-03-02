import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { recomputeAllocationForDate } from '@/lib/allocation';
import { isoDateLondon } from '@/lib/time';

function check(token: string | null) {
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!check(url.searchParams.get('token'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = isoDateLondon(new Date());
  const tomorrow = isoDateLondon(addDays(new Date(), 1));
  await recomputeAllocationForDate(today);
  await recomputeAllocationForDate(tomorrow);
  return NextResponse.json({ ok: true, today, tomorrow });
}
