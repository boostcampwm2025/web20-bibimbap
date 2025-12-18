export function isWithinReservationPeriod(
  now: Date,
  startDate: string,
  endDate: string,
): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

export function isBeforeReservationPeriod(
  now: Date,
  startDate: string,
): boolean {
  const start = new Date(startDate);
  return now < start;
}

export function isAfterReservationPeriod(now: Date, endDate: string): boolean {
  const end = new Date(endDate);
  return now > end;
}
