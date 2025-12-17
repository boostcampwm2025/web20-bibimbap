import { Module } from '@nestjs/common';
import { EventTypeController } from './event-type.controller';
import { EventTypeService } from './event-type.service';

@Module({
  controllers: [EventTypeController],
  providers: [EventTypeService],
})
export class EventTypeModule {}
