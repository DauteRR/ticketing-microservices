import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface ExpirationCompleteEventData {
  orderId: string;
}

export interface ExpirationCompleteEvent extends BaseEvent {
  subject: Subject.ExpirationComplete;
  data: ExpirationCompleteEventData;
}
