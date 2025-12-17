export interface EventType {
  id: number;
  key: string;
  displayName: string;
  isActive: boolean;
  createdAt: string; // Dates usually come as strings from JSON
  updatedAt: string;
  template?: EventTemplate;
}

export interface EventTemplate {
  id: number;
  eventTypeId: number;
  schema: EventTemplateSchema;
  version: number;
}

export interface EventTemplateSchema {
  sections: EventTemplateSection[];
}

export interface EventTemplateSection {
  title: string;
  fields: EventTemplateField[];
}

export interface EventTemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'time' | 'datetime' | 'number';
  required: boolean;
  options?: string[];
}
