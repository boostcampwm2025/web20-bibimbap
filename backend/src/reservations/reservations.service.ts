import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import type { Event } from './interfaces/event.interface';
import { EventListItemDto } from './dto/event-list-response.dto';
import { EventTransformer } from './utils/event-transformer';
import { MOCK_EVENTS } from './mock/mock-events.data';
import {
  RESERVATION_ERROR_MESSAGES,
  RESERVATION_SUCCESS_MESSAGES,
} from './constants/error-messages.constant';
import {
  isBeforeReservationPeriod,
  isAfterReservationPeriod,
} from './utils/date-utils';
import { generateReservationId } from './utils/id-generator';

@Injectable()
export class ReservationsService {
  private events: Map<string, Event> = new Map();
  private reservations: Map<string, any> = new Map();

  constructor() {
    // 테스트용 Mock
    this.events.set('1', {
      id: '1',
      title: '시니어 리뷰 세션',
      author: '운영진',
      description: '시니어 개발자와의 1:1 리뷰',
      date: '2025-12-20',
      category: 'review',
      metadata: {
        capacity: 10,
        reservedCount: 0,
        reservationStartDate: '2025-12-01T00:00:00Z',
        reservationEndDate: '2025-12-31T23:59:59Z',
      },
      createdAt: new Date(),
    });

    this.events.set('2', {
      id: '2',
      title: '오프라인 네트워킹',
      author: '운영진',
      description: '캠퍼들과의 오프라인 모임',
      date: '2025-12-25',
      category: 'off',
      metadata: {
        capacity: 5,
        reservedCount: 5, // 마감
        reservationStartDate: '2025-12-01T00:00:00Z',
        reservationEndDate: '2025-12-31T23:59:59Z',
      },
      createdAt: new Date(),
    MOCK_EVENTS.forEach((event) => {
      this.events.set(event.id, event);
    });
  }

  async createReservation(
    //캠퍼가 예약 신청
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const { eventId, userId } = createReservationDto;

    const event = this.events.get(eventId);
    if (!event) {
      return {
        success: false,
        message: RESERVATION_ERROR_MESSAGES.EVENT_NOT_FOUND,
      };
    }

    const now = new Date();

    if (isBeforeReservationPeriod(now, event.metadata.reservationStartDate)) {
      return {
        success: false,
        message: RESERVATION_ERROR_MESSAGES.RESERVATION_NOT_STARTED,
      };
    }
    if (isAfterReservationPeriod(now, event.metadata.reservationEndDate)) {
      return {
        success: false,
        message: RESERVATION_ERROR_MESSAGES.RESERVATION_ENDED,
      };
    }

    if (event.metadata.reservedCount >= event.metadata.capacity) {
      return {
        success: false,
        message: RESERVATION_ERROR_MESSAGES.CAPACITY_FULL,
      };
    }

    const reservationId = generateReservationId();
    this.reservations.set(reservationId, {
      id: reservationId,
      eventId,
      userId,
      createdAt: new Date(),
    });

    event.metadata.reservedCount++;

    return {
      success: true,
      message: RESERVATION_SUCCESS_MESSAGES.RESERVATION_CREATED,
      reservationId,
    };
  }

  async findAllEvents(): Promise<EventListItemDto[]> {
    const events = Array.from(this.events.values());
    return EventTransformer.transformMany(events);
  }
}
