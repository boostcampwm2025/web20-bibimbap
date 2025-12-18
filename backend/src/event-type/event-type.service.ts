import { Injectable, NotFoundException } from '@nestjs/common';
import { EventType } from './entities/event-type.entity';
import { EventTemplate } from './entities/event-template.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class EventTypeService {
  private eventTypes: EventType[] = [
    {
      id: 1,
      key: 'senior_review',
      displayName: '시니어 리뷰어 피드백',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      key: 'offline_participation',
      displayName: '오프라인 참석',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private eventTemplates: EventTemplate[] = [
    {
      id: 1,
      eventTypeId: 1,
      version: 1,
      schema: {
        sections: [
          {
            title: '상세 정보',
            fields: [
              { key: 'date', label: '날짜', type: 'date', required: true },
              {
                key: 'startTime',
                label: '시작 시간',
                type: 'time',
                required: true,
              },
              {
                key: 'endTime',
                label: '종료 시간',
                type: 'time',
                required: true,
              },
              {
                key: 'reviewer',
                label: '리뷰어',
                type: 'text',
                required: true,
              },
              {
                key: 'maxParticipants',
                label: '정원',
                type: 'number',
                required: true,
              },
            ],
          },
        ],
      },
    },
    {
      id: 2,
      eventTypeId: 2,
      version: 1,
      schema: {
        sections: [
          {
            title: '상세 정보',
            fields: [
              { key: 'date', label: '날짜', type: 'date', required: true },
              { key: 'location', label: '장소', type: 'text', required: true },
              {
                key: 'maxParticipants',
                label: '정원',
                type: 'number',
                required: true,
              },
            ],
          },
        ],
      },
    },
  ];

  findAll(): EventType[] {
    return this.eventTypes;
  }

  findAllWithTemplates(): (EventType & { template: EventTemplate })[] {
    return this.eventTypes.map((type) => {
      const template = this.eventTemplates.find(
        (t) => t.eventTypeId === type.id,
      );
      return {
        ...type,
        template,
      } as EventType & { template: EventTemplate };
    });
  }

  findOneTemplate(eventTypeId: number): EventTemplate {
    const template = this.eventTemplates.find(
      (t) => t.eventTypeId === eventTypeId,
    );
    if (!template) {
      throw new NotFoundException(
        `Template for event type ID ${eventTypeId} not found`,
      );
    }
    return template;
  }

  async generateTemplateExcel(eventTypeId: number): Promise<ExcelJS.Buffer> {
    const template = this.findOneTemplate(eventTypeId);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template');

    // Flatten fields from all sections
    const fields = template.schema.sections.flatMap(
      (section) => section.fields,
    );

    // Set headers
    worksheet.columns = fields.map((field) => ({
      header: field.label,
      key: field.key,
      width: 20,
    }));

    // Apply data validation and example rows if needed
    // For simplicity, we just set the header row style
    worksheet.getRow(1).font = { bold: true };

    // Apply validation for specific types
    // Note: ExcelJS data validation applies to specific cells or ranges.
    // For a template, we might want to apply it to a large range like row 2 to 1000.
    const MAX_ROWS = 1000;

    fields.forEach((field, index) => {
      const colLetter = worksheet.getColumn(index + 1).letter;
      const range = `${colLetter}2:${colLetter}${MAX_ROWS}`;

      if (field.type === 'date') {
        for (let i = 2; i <= MAX_ROWS; i++) {
          worksheet.getCell(i, index + 1).dataValidation = {
            type: 'date',
            allowBlank: true,
            operator: 'greaterThan',
            showErrorMessage: true,
            errorTitle: '유효하지 않은 날짜',
            error: '날짜 형식이 올바르지 않습니다.',
            formulae: [new Date('1900-01-01')], // Just a valid date constraint example
          };
          // Set number format for date
          worksheet.getCell(i, index + 1).numFmt = 'yyyy-mm-dd';
        }
      } else if (field.type === 'number') {
        for (let i = 2; i <= MAX_ROWS; i++) {
          worksheet.getCell(i, index + 1).dataValidation = {
            type: 'whole',
            operator: 'greaterThan',
            showErrorMessage: true,
            allowBlank: true,
            errorTitle: '유효하지 않은 숫자',
            error: '숫자만 입력 가능합니다.',
            formulae: [0],
          };
        }
      }
    });

    return workbook.xlsx.writeBuffer();
  }

  async parseTemplateExcel(
    eventTypeId: number,
    buffer: any,
  ): Promise<Record<string, any>[]> {
    const template = this.findOneTemplate(eventTypeId);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1); // First sheet

    if (!worksheet) {
      throw new Error('No worksheet found in the file');
    }

    // Flatten fields from all sections to get keys
    const fields = template.schema.sections.flatMap(
      (section) => section.fields,
    );
    const results: Record<string, any>[] = [];

    // Starting from row 2 (skipping header)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const rowData: Record<string, any> = {};

      // Map columns to fields by index
      // ExcelJS columns are 1-based
      fields.forEach((field, index) => {
        // Safe access to cell value
        const cell = row.getCell(index + 1);
        let cellValue = cell.value;

        // Handle Date and Time formatting
        if (cellValue instanceof Date) {
          if (field.type === 'date') {
            // Format to YYYY-MM-DD
            cellValue = cellValue.toISOString().split('T')[0];
          } else if (field.type === 'time') {
            // Format to HH:mm
            // Excel often stores time as a date with 1899-12-30 or current date.
            // We just extract hours and minutes.
            const hours = cellValue.getUTCHours().toString().padStart(2, '0');
            const minutes = cellValue
              .getUTCMinutes()
              .toString()
              .padStart(2, '0');
            cellValue = `${hours}:${minutes}`;
          }
        }
        // Handle rich text (ExcelJS can return object with 'richText' property)
        else if (
          typeof cellValue === 'object' &&
          cellValue !== null &&
          'richText' in cellValue
        ) {
          cellValue = (cellValue as any).richText
            .map((t: any) => t.text)
            .join('');
        }

        rowData[field.key] = cellValue;
      });

      // Filter out empty rows if necessary
      if (Object.keys(rowData).some((k) => rowData[k] != null)) {
        results.push(rowData);
      }
    });

    return results;
  }
}
