import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const staff = await prisma.staff.findMany({ where: { active: true }, orderBy: { name: 'asc' } });

  return (
    <main className="container">
      <div className="card">
        <h1>Office Movement + Parking</h1>
        <p>Select your name to continue.</p>
        <form action="/week" className="inline">
          <input list="staff" name="name" placeholder="Type your name" required />
          <datalist id="staff">
            {staff.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
          <button type="submit">Continue</button>
        </form>
      </div>
      <div className="card">
        <Link href="/admin">Admin</Link>
      </div>
    </main>
  );
}
