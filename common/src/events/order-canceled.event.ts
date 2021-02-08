import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface OrderCanceledEventData {
  id: string;
  ticket: {
    id: string;
  };
}

export interface OrderCanceledEvent extends BaseEvent {
  subject: Subject.OrderCanceled;
  data: OrderCanceledEventData;
}
