import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface OrderCanceledEventData {
  id: string;
  version: number;
  ticket: {
    id: string;
  };
}

export interface OrderCanceledEvent extends BaseEvent {
  subject: Subject.OrderCanceled;
  data: OrderCanceledEventData;
}
