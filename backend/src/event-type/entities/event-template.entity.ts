export class EventTemplate {
  id: number;
  eventTypeId: number;
  schema: any; // Using 'any' for now, can be stricter later
  version: number;
}
