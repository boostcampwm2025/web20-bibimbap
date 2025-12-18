export class EventListItemDto {
  id: number;
  title: string;
  status: 'progress' | 'scheduled' | 'ended';
  platform: 'web' | 'android' | 'ios';
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}
