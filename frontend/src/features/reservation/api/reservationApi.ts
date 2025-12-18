import type { ReservationRequest, ReservationResponse } from "../types";
import type { SlotInfo } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const baseURL = `${BACKEND_URL}/api`;

export const reservationApi = {
  createReservation: async (
    request: ReservationRequest
  ): Promise<ReservationResponse> => {
    const response = await fetch(`${baseURL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  getSlots: async (): Promise<SlotInfo[]> => {
    const response = await fetch(`${baseURL}/reservations/slots`);
    if (!response.ok) {
      throw new Error("Failed to fetch slots");
    }
    return response.json();
  },
};
