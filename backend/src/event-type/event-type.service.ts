import { Injectable, NotFoundException } from '@nestjs/common';
import { EventType } from './entities/event-type.entity';
import { EventTemplate } from './entities/event-template.entity';

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
    }
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
              { key: 'startTime', label: '시작 시간', type: 'time', required: true },
              { key: 'endTime', label: '종료 시간', type: 'time', required: true },
              { key: 'reviewer', label: '리뷰어', type: 'text', required: true },
              { key: 'maxParticipants', label: '정원', type: 'number', required: true }
            ]
          }
        ]
      }
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
                { key: 'maxParticipants', label: '정원', type: 'number', required: true }
              ]
            }
          ]
        }
      }
  ];

  findAll(): EventType[] {
    return this.eventTypes;
  }

  findAllWithTemplates(): (EventType & { template: EventTemplate })[] {
    return this.eventTypes.map(type => {
      const template = this.eventTemplates.find(t => t.eventTypeId === type.id);
      return {
        ...type,
        template,
      } as EventType & { template: EventTemplate };
    });
  }

  findOneTemplate(eventTypeId: number): EventTemplate {
    const template = this.eventTemplates.find(t => t.eventTypeId === eventTypeId);
    if (!template) {
      throw new NotFoundException(`Template for event type ID ${eventTypeId} not found`);
    }
    return template;
  }
}
