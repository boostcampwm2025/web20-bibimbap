export interface EventMetadata {
  capacity: number;
  reservedCount: number;
  reservationStartDate: string;
  reservationEndDate: string;
}

export interface Event {
  id: string;
  title: string;
  author: string;
  description?: string;
  date: string;
  category: 'off' | 'review';
  metadata: EventMetadata;
  createdAt: Date;
}
