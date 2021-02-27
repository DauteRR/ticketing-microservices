import {
  Publisher,
  ExpirationCompleteEvent,
  Subject
} from '@drrtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
}
