const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatShort(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatLong(date: Date): string {
  return `${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function monthShort(date: Date): string {
  return MONTHS_SHORT[date.getMonth()].toUpperCase();
}

export function dayOfMonth(date: Date): string {
  return String(date.getDate()).padStart(2, '0');
}

export function cancellationDeadline(renewalDate: Date, noticeDays: number): Date {
  return addDays(renewalDate, -noticeDays);
}

export function internalReminder(deadline: Date): Date {
  return addDays(deadline, -30);
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}
