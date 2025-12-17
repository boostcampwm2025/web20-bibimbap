import type { EventType, EventTemplate } from '../types';

export const fetchEventTypes = async (): Promise<EventType[]> => {
  const response = await fetch('/api/event-types');
  if (!response.ok) {
    throw new Error('Failed to fetch event types');
  }
  return response.json();
};

export const fetchEventTypesExpanded = async (): Promise<(EventType & { template: EventTemplate })[]> => {
  const response = await fetch('/api/event-types/expanded');
  if (!response.ok) {
    throw new Error('Failed to fetch event types with templates');
  }
  return response.json();
};

export const fetchEventTemplate = async (eventTypeId: number): Promise<EventTemplate> => {
  const response = await fetch(`/api/event-types/${eventTypeId}/template`);
  if (!response.ok) {
    throw new Error('Failed to fetch event template');
  }
  return response.json();
};
