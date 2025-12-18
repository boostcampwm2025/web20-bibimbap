export const RESERVATION_ERROR_MESSAGES = {
  EVENT_NOT_FOUND: '존재하지 않는 이벤트입니다.',
  RESERVATION_NOT_STARTED: '예약 신청 기간이 아닙니다.',
  RESERVATION_ENDED: '예약 신청 기간이 종료되었습니다.',
  CAPACITY_FULL: '예약이 마감되었습니다.',
} as const;

export const RESERVATION_SUCCESS_MESSAGES = {
  RESERVATION_CREATED: '예약이 완료되었습니다.',
} as const;
