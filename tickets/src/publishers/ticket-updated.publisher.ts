import { Publisher, Subject, TicketUpdatedEvent } from '@drrtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
}
