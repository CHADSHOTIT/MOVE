import { redirect } from 'next/navigation';
import { addDays, format, parseISO } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getWeekData, statusOptions } from '@/lib/week-data';
import { isDayLocked, weekStartFrom, weekDates } from '@/lib/time';
import { recomputeWeek } from '@/lib/allocation';

export default async function WeekPage({ searchParams }: { searchParams: { name?: string; week?: string } }) {
  const name = searchParams.name;
  if (!name) redirect('/');
  const staff = await prisma.staff.findFirst({ where: { name, active: true } });
  if (!staff) redirect('/');

  const weekStart = searchParams.week ? parseISO(searchParams.week) : weekStartFrom(new Date());
  const dates = weekDates(weekStart);
  await recomputeWeek(dates);
  const data = await getWeekData(dates, staff.id);

  const prevWeek = format(addDays(weekStart, -7), 'yyyy-MM-dd');
  const nextWeek = format(addDays(weekStart, 7), 'yyyy-MM-dd');

  return (
    <main className="container">
      <div className="card inline">
        <h2>{staff.name}</h2>
        <a href={`/week?name=${encodeURIComponent(name)}&week=${prevWeek}`}>← Previous</a>
        <a href={`/week?name=${encodeURIComponent(name)}&week=${nextWeek}`}>Next →</a>
      </div>
      <div className="card grid">
        {data.map((d) => {
          const locked = isDayLocked(d.dateISO);
          const assigned = d.assignment ? `${d.assignment.assignmentType === 'OWNER' ? 'Own bay' : 'Assigned bay'}: ${d.assignment.bayNumber}` : d.movement?.status === 'OFFICE' ? 'No bay available' : 'Not in office';
          return (
            <form className={locked ? 'locked' : ''} key={d.dateISO} action="/api/movement" method="post">
              <input type="hidden" name="staffId" value={staff.id} />
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="week" value={format(weekStart, 'yyyy-MM-dd')} />
              <input type="hidden" name="dateISO" value={d.dateISO} />
              <strong>{d.dateISO}</strong>
              <div>
                <select name="status" defaultValue={d.movement?.status ?? ''} disabled={locked} required>
                  <option value="">-- Select --</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <input name="noteText" placeholder="Optional note" defaultValue={d.movement?.noteText ?? ''} disabled={locked || d.movement?.status !== 'OTHER'} />
              </div>
              <div className="badge">{assigned}</div>
              <div style={{ fontSize: 12 }}>{d.request ? `Office request: ${d.request.requestedAt.toISOString()}` : ''}</div>
              {!locked && <button type="submit">Save</button>}
            </form>
          );
        })}
      </div>
    </main>
  );
}
