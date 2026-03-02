import { prisma } from '@/lib/prisma';
import { weekDates, weekStartFrom } from '@/lib/time';
import { recomputeWeek } from '@/lib/allocation';

function isAuthorized(token?: string) {
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

export default async function AdminPage({ searchParams }: { searchParams: { token?: string } }) {
  if (!isAuthorized(searchParams.token)) return <main className="container"><div className="card">Unauthorized. Provide ?token=...</div></main>;

  const staff = await prisma.staff.findMany({ orderBy: { name: 'asc' } });
  const setting = await prisma.setting.findUnique({ where: { key: 'owner_cutoff_hhmm' } });
  const cutoff = setting?.value ?? '18:00';
  const start = weekStartFrom(new Date());
  const days = weekDates(start);
  await recomputeWeek(days);
  const assignments = await prisma.bayAssignment.findMany({ where: { dateISO: { in: days } }, include: { assignedTo: true }, orderBy: [{ dateISO: 'asc' }, { bayNumber: 'asc' }] });

  return (
    <main className="container">
      <div className="card"><h1>Admin</h1></div>

      <div className="card">
        <h3>Settings</h3>
        <form method="post" action="/api/admin/settings" className="inline">
          <label>Owner cutoff (HH:mm previous day)</label>
          <input name="ownerCutoff" defaultValue={cutoff} pattern="^([01]\d|2[0-3]):([0-5]\d)$" required />
          <input type="hidden" name="token" value={searchParams.token} />
          <button type="submit">Save cutoff</button>
        </form>
      </div>

      <div className="card">
        <h3>Add staff</h3>
        <form method="post" action="/api/admin/staff" className="inline">
          <input name="name" placeholder="Name" required />
          <label><input type="checkbox" name="isOwner" /> Bay owner</label>
          <input name="ownerBayNumber" type="number" placeholder="Bay #" min={1} />
          <input type="hidden" name="token" value={searchParams.token} />
          <input type="hidden" name="actionType" value="create" />
          <button type="submit">Add staff</button>
        </form>
      </div>

      <div className="card">
        <h3>Edit / remove staff</h3>
        {staff.map((s) => (
          <form key={s.id} method="post" action="/api/admin/staff" className="inline" style={{ marginBottom: 8 }}>
            <input type="hidden" name="staffId" value={s.id} />
            <input type="hidden" name="token" value={searchParams.token} />
            <input name="name" defaultValue={s.name} required />
            <label><input type="checkbox" name="isOwner" defaultChecked={s.isOwner} /> Owner</label>
            <input name="ownerBayNumber" type="number" defaultValue={s.ownerBayNumber ?? ''} min={1} placeholder="Bay #" />
            <label><input type="checkbox" name="active" defaultChecked={s.active} /> Active</label>
            <button type="submit" name="actionType" value="update">Save</button>
            <button type="submit" name="actionType" value="delete">Remove</button>
          </form>
        ))}
      </div>

      <div className="card">
        <a href={`/api/export?token=${searchParams.token}`}>Export current week XLSX</a>
      </div>

      <div className="card">
        <h3>Current week allocations</h3>
        {assignments.map((a) => <div key={a.id}>{a.dateISO} - Bay {a.bayNumber}: {a.assignedTo.name} ({a.assignmentType})</div>)}
      </div>
    </main>
  );
}
