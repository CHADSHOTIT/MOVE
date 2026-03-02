import { addDays, format, startOfWeek } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const LONDON_TZ = 'Europe/London';

export function isoDateLondon(date: Date) {
  return format(toZonedTime(date, LONDON_TZ), 'yyyy-MM-dd');
}

export function weekStartFrom(date: Date) {
  return startOfWeek(toZonedTime(date, LONDON_TZ), { weekStartsOn: 1 });
}

export function weekDates(weekStart: Date) {
  return Array.from({ length: 5 }, (_, i) => isoDateLondon(addDays(weekStart, i)));
}

export function isDayLocked(dateISO: string) {
  const today = isoDateLondon(new Date());
  return dateISO <= today;
}

export function cutoffDateTimeFor(targetDateISO: string, cutoffHHmm: string) {
  const [year, month, day] = targetDateISO.split('-').map(Number);
  const [hh, mm] = cutoffHHmm.split(':').map(Number);

  const targetUtc = new Date(Date.UTC(year, month - 1, day));
  const prevUtc = addDays(targetUtc, -1);
  const prevDate = format(prevUtc, 'yyyy-MM-dd');
  const wallClock = `${prevDate}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`;
  return fromZonedTime(wallClock, LONDON_TZ);
}
