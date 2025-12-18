import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Patch,
  Post,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { UpdateSlotCapacityDto } from './dto/update-slot-capacity.dto';
import { EventListItemDto } from './dto/event-list-response.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('events')
  async getEvents(): Promise<EventListItemDto[]> {
    return this.reservationsService.findAllEvents();
  }

  @Post()
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    return await this.reservationsService.createReservation(
      createReservationDto,
    );
  }

  @Sse('capacity-updates')
  streamCapacityUpdates(): Observable<MessageEvent> {
    return this.reservationsService.getCapacityUpdates().pipe(
      map((event) => ({
        data: JSON.stringify(event),
      })),
    );
  }

  @Get('slot-capacities')
  getSlotCapacities() {
    return this.reservationsService.getAllSlotCapacities();
  }

  @Get('slots')
  getSlots() {
    return this.reservationsService.getSlots();
  }

  @Patch('slot-capacities/:slotId')
  updateSlotCapacity(
    @Param('slotId') slotId: string,
    @Body() updateSlotCapacityDto: UpdateSlotCapacityDto,
  ) {
    return this.reservationsService.updateSlotCapacity(
      Number(slotId),
      updateSlotCapacityDto,
    );
  }
}
