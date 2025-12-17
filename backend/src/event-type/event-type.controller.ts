import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { EventType } from './entities/event-type.entity';
import { EventTemplate } from './entities/event-template.entity';

@Controller('api/event-types')
export class EventTypeController {
  constructor(private readonly eventTypeService: EventTypeService) {}

  @Get()
  findAll(): EventType[] {
    return this.eventTypeService.findAll();
  }

  @Get('expanded')
  findAllWithTemplates() {
    return this.eventTypeService.findAllWithTemplates();
  }

  @Get(':id/template')
  getTemplate(@Param('id', ParseIntPipe) id: number): EventTemplate {
    return this.eventTypeService.findOneTemplate(id);
  }
}
