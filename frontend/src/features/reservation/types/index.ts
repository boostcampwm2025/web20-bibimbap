// 예약 요청
export interface ReservationRequest {
  eventId: string;
  userId: string;
}

// 예약 응답
export interface ReservationResponse {
  success: boolean;
  message: string;
  reservationId?: string;
}

// 실시간 정원 업데이트

// 예약 상태

// 예약 결과
