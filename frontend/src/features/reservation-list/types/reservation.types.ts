// 예약 상태 타입
export type ReservationStatus = 'progress' | 'scheduled' | 'ended';

// 플랫폼 타입
export type Platform = 'web' | 'android' | 'ios';

// 예약 데이터 인터페이스
export interface Reservation {
  id: number;
  title: string;
  status: ReservationStatus;
  platform: Platform;
  description: string;
  startDate: string; // ISO 8601 형식
  endDate: string; // ISO 8601 형식
  createdAt: string; // ISO 8601 형식
}
