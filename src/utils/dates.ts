/** Fixed reference date for consistent schedule filtering across the app. */
export const REFERENCE_DATE = new Date('2026-07-01T00:00:00');

/** Shared meeting horizon used by Dashboard and Schedule views. */
export const MEETING_HORIZON_DAYS = 30;

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isOnOrAfter(dateStr: string, reference: Date = REFERENCE_DATE): boolean {
  return parseDate(dateStr) >= reference;
}

export function isWithinDays(dateStr: string, days: number, reference: Date = REFERENCE_DATE): boolean {
  return isOnOrAfter(dateStr, reference) && parseDate(dateStr) <= addDays(reference, days);
}