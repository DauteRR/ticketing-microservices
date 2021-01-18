import { BaseEvent } from './base.event';
import { Subject } from './subject';

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
