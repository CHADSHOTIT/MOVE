import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { weekDates, weekStartFrom } from '@/lib/time';

function check(token: string | null) {
  return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!check(url.searchParams.get('token'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = weekDates(weekStartFrom(new Date()));
  const staff = await prisma.staff.findMany({ orderBy: { name: 'asc' } });
  const movements = await prisma.movement.findMany({ where: { dateISO: { in: days } } });
  const assignments = await prisma.bayAssignment.findMany({ where: { dateISO: { in: days } } });
  const requests = await prisma.officeRequest.findMany({ where: { dateISO: { in: days } } });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Week');
  const headers = ['Staff name', 'Bay Owner', 'Owner bay'];
  for (const d of days) headers.push(`${d} status`, `${d} assigned bay`, `${d} office requested at`);
  ws.addRow(headers);

  for (const s of staff) {
    const row: (string | number | null)[] = [s.name, s.isOwner ? 'Yes' : 'No', s.ownerBayNumber];
    for (const d of days) {
      const m = movements.find((x) => x.staffId === s.id && x.dateISO === d);
      const a = assignments.find((x) => x.assignedToStaffId === s.id && x.dateISO === d);
      const r = requests.find((x) => x.staffId === s.id && x.dateISO === d);
      row.push(m?.status ?? '', a?.bayNumber ?? '', r?.requestedAt.toISOString() ?? '');
    }
    ws.addRow(row);
  }

  const summary = wb.addWorksheet('Summary');
  summary.addRow(['Date', 'Office count', 'Bays used', 'Unassigned office requests']);
  for (const d of days) {
    const office = movements.filter((m) => m.dateISO === d && m.status === 'OFFICE').length;
    const baysUsed = assignments.filter((a) => a.dateISO === d).length;
    const unassigned = Math.max(office - baysUsed, 0);
    summary.addRow([d, office, baysUsed, unassigned]);
  }

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="office-movement-week.xlsx"',
    },
  });
}
