import type { EventType, EventTemplate } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_BASE = `${BACKEND_URL}/api`;

export const fetchEventTypes = async (): Promise<EventType[]> => {
  const response = await fetch(`${API_BASE}/event-types`);
  if (!response.ok) {
    throw new Error('Failed to fetch event types');
  }
  return response.json();
};

export const fetchEventTypesExpanded = async (): Promise<(EventType & { template: EventTemplate })[]> => {
  const response = await fetch(`${API_BASE}/event-types/expanded`);
  if (!response.ok) {
    throw new Error('Failed to fetch event types with templates');
  }
  return response.json();
};


export const fetchEventTemplate = async (eventTypeId: number): Promise<EventTemplate> => {
  const response = await fetch(`${API_BASE}/event-types/${eventTypeId}/template`);
  if (!response.ok) {
    throw new Error('Failed to fetch event template');
  }
  return response.json();
};

export const downloadEventTemplate = async (eventTypeId: number, title: string) => {
  const response = await fetch(`${API_BASE}/event-types/${eventTypeId}/template/download`);
  if (!response.ok) {
    throw new Error('Failed to download template');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}_template.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadEventTemplate = async (eventTypeId: number, file: File): Promise<Record<string, any>[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/event-types/${eventTypeId}/template/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload template');
  }

  return response.json();
};
