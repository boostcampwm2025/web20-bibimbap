const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
export const API_BASE_URL = `${BACKEND_URL}/api` as const;

export const API_ENDPOINTS = {
  RESERVATIONS_EVENTS: `${API_BASE_URL}/reservations/events`,
} as const;
