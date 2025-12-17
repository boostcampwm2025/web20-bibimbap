import type { ReservationStatus, Platform } from '../features/reservation-list/types/reservation.types';

// 상태 라벨 매핑
export const STATUS_LABELS: Record<ReservationStatus, string> = {
  progress: '진행 중',
  scheduled: '예정',
  ended: '종료',
};

// 플랫폼 라벨 매핑
export const PLATFORM_LABELS: Record<Platform, string> = {
  web: 'WEB',
  android: 'AND',
  ios: 'IOS',
};
