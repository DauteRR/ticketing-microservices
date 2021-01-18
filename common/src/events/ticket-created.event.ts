import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface TicketCreatedEventData {
  id: string;
  title: string;
  price: number;
  userId: string;
}

export interface TicketCreatedEvent extends BaseEvent {
  subject: Subject.TicketCreated;
  data: TicketCreatedEventData;
}
