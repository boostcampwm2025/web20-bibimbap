import type { Reservation } from '../types/reservation.types';
import { API_ENDPOINTS } from '../../../constants/api.constants';

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(API_ENDPOINTS.RESERVATIONS_EVENTS);

  if (!response.ok) {
    throw new Error(`Failed to fetch reservations: ${response.statusText}`);
  }

  return response.json();
}
