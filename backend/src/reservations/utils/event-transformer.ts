import type { Event } from '../interfaces/event.interface';
import { EventListItemDto } from '../dto/event-list-response.dto';
import { CATEGORY_TO_PLATFORM_MAP } from '../constants/event-categories.constant';

export class EventTransformer {
  /**
   * Converts string ID to number using hash function
   */
  private static convertIdToNumber(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Maps event category to platform
   */
  private static mapCategoryToPlatform(
    category: 'off' | 'review',
  ): 'web' | 'android' | 'ios' {
    return CATEGORY_TO_PLATFORM_MAP[category];
  }

  /**
   * Computes event status based on current date and event dates
   */
  private static computeStatus(
    event: Event,
  ): 'progress' | 'scheduled' | 'ended' {
    const now = new Date();
    const eventDate = new Date(event.date);
    const reservationStartDate = new Date(event.metadata.reservationStartDate);
    const reservationEndDate = new Date(event.metadata.reservationEndDate);

    if (now > eventDate) {
      return 'ended';
    } else if (now >= reservationStartDate && now <= reservationEndDate) {
      return 'progress';
    } else {
      return 'scheduled';
    }
  }

  /**
   * Transforms Event to EventListItemDto
   */
  static transformToDto(event: Event): EventListItemDto {
    return {
      id: this.convertIdToNumber(event.id),
      title: event.title,
      status: this.computeStatus(event),
      platform: this.mapCategoryToPlatform(event.category),
      description: event.description || '',
      startDate: event.date,
      endDate: event.metadata.reservationEndDate,
      createdAt: event.createdAt.toISOString(),
    };
  }

  /**
   * Transforms array of Events to array of EventListItemDto
   */
  static transformMany(events: Event[]): EventListItemDto[] {
    return events.map((event) => this.transformToDto(event));
  }
}
