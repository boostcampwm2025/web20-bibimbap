import { Injectable } from '@nestjs/common';
import { Subject, Observable, concat, of } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { UpdateSlotCapacityDto } from './dto/update-slot-capacity.dto';
import type { Event } from './interfaces/event.interface';
import { EventListItemDto } from './dto/event-list-response.dto';
import { EventTransformer } from './utils/event-transformer';
import { MOCK_EVENTS } from './mock/mock-events.data';
import {
  RESERVATION_ERROR_MESSAGES,
  RESERVATION_SUCCESS_MESSAGES,
} from './constants/error-messages.constant';
import {
  isAfterReservationPeriod,
  isBeforeReservationPeriod,
} from './utils/date-utils';
import { generateReservationId } from './utils/id-generator';

export interface CapacityUpdateEvent {
  snapshot: Array<{
    slotId: number;
    currentCount: number;
    maxCapacity: number;
  }>;
  updatedSlotId?: number;
  eventId?: string;
}

interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  slotId: number;
  createdAt: Date;
}

interface SlotInfo {
  id: number;
  dateLabel: string;
  timeLabel: string;
  reviewer: string;
}

@Injectable()
export class ReservationsService {
  private events: Map<string, Event> = new Map();
  private reservations: Map<string, Reservation> = new Map();
  private slots: SlotInfo[] = [
    {
      id: 1,
      dateLabel: '2024-12-20',
      timeLabel: '14:00 - 15:00',
      reviewer: '김멘토',
    },
    {
      id: 2,
      dateLabel: '2024-12-20',
      timeLabel: '15:00 - 16:00',
      reviewer: '이멘토',
    },
    {
      id: 3,
      dateLabel: '2024-12-21',
      timeLabel: '14:00 - 15:00',
      reviewer: '박멘토',
    },
    {
      id: 4,
      dateLabel: '2024-12-21',
      timeLabel: '15:00 - 16:00',
      reviewer: '최멘토',
    },
    {
      id: 5,
      dateLabel: '2024-12-22',
      timeLabel: '14:00 - 15:00',
      reviewer: '강멘토',
    },
  ];

  // 슬롯별 정원 관리 (slotId -> { currentCount, maxCapacity })
  private slotCapacities: Map<
    number,
    { currentCount: number; maxCapacity: number }
  > = new Map();

  // SSE 이벤트 스트림
  private capacityUpdateSubject = new Subject<CapacityUpdateEvent>();
  public capacityUpdate$ = this.capacityUpdateSubject.asObservable();

  constructor() {
    MOCK_EVENTS.forEach((event) => {
      this.events.set(event.id, event);
    });

    // 테스트용 슬롯 정원 초기화 (프론트엔드의 SlotItem과 매칭)
    this.slotCapacities.set(1, { currentCount: 0, maxCapacity: 2 });
    this.slotCapacities.set(2, { currentCount: 1, maxCapacity: 1 }); // 마감
    this.slotCapacities.set(3, { currentCount: 1, maxCapacity: 2 });
    this.slotCapacities.set(4, { currentCount: 0, maxCapacity: 2 });
    this.slotCapacities.set(5, { currentCount: 0, maxCapacity: 1 });
  }

  /**
   * 슬롯별 정원 정보 조회
   */
  getSlotCapacity(
    slotId: number,
  ): { currentCount: number; maxCapacity: number } | null {
    return this.slotCapacities.get(slotId) || null;
  }

  /**
   * 모든 슬롯의 정원 정보 조회
   */
  getAllSlotCapacities(): Array<{
    slotId: number;
    currentCount: number;
    maxCapacity: number;
  }> {
    return Array.from(this.slotCapacities.entries()).map(
      ([slotId, capacity]) => ({
        slotId,
        currentCount: capacity.currentCount,
        maxCapacity: capacity.maxCapacity,
      }),
    );
  }

  /**
   * 슬롯 기본 정보 + 현재 정원 상태
   */
  getSlots() {
    return this.slots.map((slot) => {
      const capacity = this.slotCapacities.get(slot.id);
      return {
        ...slot,
        currentCount: capacity?.currentCount ?? 0,
        maxCapacity: capacity?.maxCapacity ?? 0,
      };
    });
  }

  /**
   * 초기 정원 상태와 이후 변동을 모두 포함한 SSE 스트림
   */
  getCapacityUpdates(): Observable<CapacityUpdateEvent> {
    const initialEvent = this.buildCapacitySnapshot();
    // 첫 연결 시 전체 슬롯 스냅샷을 전달
    return concat(of(initialEvent), this.capacityUpdate$);
  }

  /**
   * 정원 변경 이벤트 발행
   */
  private emitCapacityUpdate(slotId: number, eventId?: string): void {
    const snapshot = this.buildCapacitySnapshot(slotId, eventId);
    this.capacityUpdateSubject.next(snapshot);
  }

  /**
   * 현재 슬롯 정원 전체 스냅샷 생성
   */
  private buildCapacitySnapshot(
    updatedSlotId?: number,
    eventId?: string,
  ): CapacityUpdateEvent {
    return {
      snapshot: this.getAllSlotCapacities(),
      updatedSlotId,
      eventId,
    };
  }

  /**
   * 사용자의 기존 예약 찾기
   */
  private findUserReservation(
    userId: string,
    eventId: string,
  ): { reservationId: string; slotId: number } | null {
    for (const [reservationId, reservation] of this.reservations.entries()) {
      if (reservation.userId === userId && reservation.eventId === eventId) {
        return { reservationId, slotId: reservation.slotId };
      }
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async createReservation(
    //캠퍼가 예약 신청
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const { eventId, userId, slotId } = createReservationDto;

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

    // 기존 예약 확인
    const existingReservation = this.findUserReservation(userId, eventId);
    const previousSlotId = existingReservation?.slotId;

    // 새 슬롯별 정원 확인
    const slotCapacity = this.slotCapacities.get(slotId);
    if (!slotCapacity) {
      return {
        success: false,
        message: '존재하지 않는 슬롯입니다.',
      };
    }

    // 같은 슬롯으로 예약 수정하는 경우는 그냥 성공 처리
    if (previousSlotId === slotId && existingReservation) {
      return {
        success: true,
        message: '예약이 이미 해당 슬롯으로 설정되어 있습니다.',
        reservationId: existingReservation.reservationId,
      };
    }

    // 새 슬롯이 마감되었는지 확인
    if (slotCapacity.currentCount >= slotCapacity.maxCapacity) {
      return {
        success: false,
        message: RESERVATION_ERROR_MESSAGES.CAPACITY_FULL,
      };
    }

    let reservationId = existingReservation?.reservationId;
    const isNewReservation = !existingReservation;

    // 기존 예약이 있으면 이전 슬롯 정원 감소
    if (existingReservation && previousSlotId !== undefined) {
      const previousSlotCapacity = this.slotCapacities.get(previousSlotId);
      if (previousSlotCapacity) {
        previousSlotCapacity.currentCount = Math.max(
          0,
          previousSlotCapacity.currentCount - 1,
        );
        this.emitCapacityUpdate(previousSlotId, eventId);
      }
      // 기존 예약 업데이트
      const reservation = this.reservations.get(reservationId);
      if (reservation) {
        reservation.slotId = slotId;
      }
    } else {
      // 새 예약 생성
      reservationId = generateReservationId();
      this.reservations.set(reservationId, {
        id: reservationId,
        eventId,
        userId,
        slotId,
        createdAt: new Date(),
      });
    }

    // 새 슬롯 정원 증가 및 이벤트 발행
    slotCapacity.currentCount++;
    if (isNewReservation) {
      event.metadata.reservedCount++;
    }
    this.emitCapacityUpdate(slotId, eventId);

    return {
      success: true,
      message: existingReservation
        ? '예약이 수정되었습니다.'
        : RESERVATION_SUCCESS_MESSAGES.RESERVATION_CREATED,
      reservationId,
    };
  }

  /**
   * 슬롯 정원 변경 (테스트용)
   */
  updateSlotCapacity(
    slotId: number,
    { currentCount, maxCapacity, eventId }: UpdateSlotCapacityDto,
  ) {
    if (Number.isNaN(slotId)) {
      return {
        success: false,
        message: '유효하지 않은 슬롯 ID입니다.',
      };
    }

    const existingCapacity = this.slotCapacities.get(slotId);
    const nextMaxCapacity = maxCapacity ?? existingCapacity?.maxCapacity ?? 0;

    if (nextMaxCapacity <= 0) {
      return {
        success: false,
        message: 'maxCapacity는 1 이상이어야 합니다.',
      };
    }

    const nextCurrentCount = (() => {
      const rawCount = currentCount ?? existingCapacity?.currentCount ?? 0;
      if (rawCount < 0) return 0;
      if (rawCount > nextMaxCapacity) return nextMaxCapacity;
      return rawCount;
    })();

    this.slotCapacities.set(slotId, {
      currentCount: nextCurrentCount,
      maxCapacity: nextMaxCapacity,
    });
    this.emitCapacityUpdate(slotId, eventId);

    return {
      success: true,
      message: '슬롯 정원이 업데이트되었습니다.',
      slotId,
      currentCount: nextCurrentCount,
      maxCapacity: nextMaxCapacity,
    };
  }

  async findAllEvents(): Promise<EventListItemDto[]> {
    const events = Array.from(this.events.values());
    return EventTransformer.transformMany(events);
  }
}
