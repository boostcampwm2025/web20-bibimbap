import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { EventTypeModule } from './event-type/event-type.module';

@Module({
  imports: [EventTypeModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
