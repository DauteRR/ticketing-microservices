import { TicketDocument } from '../models/ticket.model';

export interface CreateTicketDto {
  title: string;
  price: number;
}

export interface CreateTicketResponse extends TicketDocument {}
