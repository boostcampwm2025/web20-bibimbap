import type { ReservationRequest, ReservationResponse } from "../types";

const baseURL = "/api";

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
};
