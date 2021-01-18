import { Subject, BaseEvent } from './';

export interface TicketUpdatedEventData {
  id: string;
  title: string;
  price: number;
  userId: string;
}

export interface TicketUpdatedEvent extends BaseEvent {
  subject: Subject.TicketUpdated;
  data: TicketUpdatedEventData;
}
