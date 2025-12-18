import { Controller, Post, Get, Body } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
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
    return this.reservationsService.createReservation(createReservationDto);
  }
}
