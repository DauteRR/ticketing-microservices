import { OrderStatus } from '../types/order';
import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface PaymentCreatedEventData {
  id: string;
  orderId: string;
  chargeId: string;
}

export interface PaymentCreatedEvent extends BaseEvent {
  subject: Subject.PaymentCreated;
  data: PaymentCreatedEventData;
}
