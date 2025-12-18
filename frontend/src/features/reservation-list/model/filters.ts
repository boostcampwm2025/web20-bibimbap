import type { Reservation } from '../types/reservation.types';

/**
 * 검색어로 예약을 필터링합니다 (제목 + 설명)
 */
export function filterBySearch(
  reservations: Reservation[],
  searchQuery: string,
): Reservation[] {
  if (searchQuery === '') return reservations;

  const lowerQuery = searchQuery.toLowerCase();
  return reservations.filter(
    (reservation) =>
      reservation.title.toLowerCase().includes(lowerQuery) ||
      reservation.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * 상태/플랫폼으로 예약을 필터링합니다
 */
export function filterByStatus(
  reservations: Reservation[],
  filterQuery: string,
): Reservation[] {
  if (filterQuery === '') return reservations;

  const lowerQuery = filterQuery.toLowerCase();
  return reservations.filter(
    (reservation) =>
      reservation.status.toLowerCase().includes(lowerQuery) ||
      reservation.platform.toLowerCase().includes(lowerQuery),
  );
}

/**
 * 검색어와 상태/플랫폼으로 예약을 필터링합니다
 */
export function filterReservations(
  reservations: Reservation[],
  searchQuery: string,
  filterQuery: string,
): Reservation[] {
  let filtered = reservations;
  filtered = filterBySearch(filtered, searchQuery);
  filtered = filterByStatus(filtered, filterQuery);
  return filtered;
}
