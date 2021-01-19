import { Publisher, Subject, TicketCreatedEvent } from '@drrtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
}
