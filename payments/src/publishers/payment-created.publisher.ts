import { PaymentCreatedEvent, Publisher, Subject } from '@drrtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
