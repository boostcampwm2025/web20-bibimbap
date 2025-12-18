export function generateReservationId(): string {
  return `reservation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
