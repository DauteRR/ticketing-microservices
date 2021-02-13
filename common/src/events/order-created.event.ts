import { OrderStatus } from '../types/order';
import { BaseEvent } from './base.event';
import { Subject } from './subject';

export interface OrderCreatedEventData {
  id: string;
  version: number;
  status: OrderStatus;
  userId: string;
  expiresAt: string;
  ticket: {
    id: string;
    price: number;
  };
}

export interface OrderCreatedEvent extends BaseEvent {
  subject: Subject.OrderCreated;
  data: OrderCreatedEventData;
}
