import type { Event } from '../interfaces/event.interface';
import { EVENT_CATEGORIES } from '../constants/event-categories.constant';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: '시니어 리뷰 세션',
    author: '운영진',
    description: '시니어 개발자와의 1:1 리뷰',
    date: '2025-12-20',
    category: EVENT_CATEGORIES.REVIEW,
    metadata: {
      capacity: 10,
      reservedCount: 0,
      reservationStartDate: '2025-12-01T00:00:00Z',
      reservationEndDate: '2025-12-31T23:59:59Z',
    },
    createdAt: new Date(),
  },
  {
    id: 'event-2',
    title: '오프라인 네트워킹',
    author: '운영진',
    description: '캠퍼들과의 오프라인 모임',
    date: '2025-12-25',
    category: EVENT_CATEGORIES.OFFLINE,
    metadata: {
      capacity: 5,
      reservedCount: 5,
      reservationStartDate: '2025-12-01T00:00:00Z',
      reservationEndDate: '2025-12-31T23:59:59Z',
    },
    createdAt: new Date(),
  },
];
