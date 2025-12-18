import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  StreamableFile,
  Header,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventTypeService } from './event-type.service';
import { EventType } from './entities/event-type.entity';
import { EventTemplate } from './entities/event-template.entity';
import type { Express } from 'express';

@Controller('event-types')
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

  @Get(':id/template/download')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="template.xlsx"')
  async downloadTemplate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const buffer = await this.eventTypeService.generateTemplateExcel(id);
    return new StreamableFile(new Uint8Array(buffer));
  }

  @Post(':id/template/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventTypeService.parseTemplateExcel(id, file.buffer);
  }
}
