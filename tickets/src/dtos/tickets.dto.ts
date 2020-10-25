import { TicketDocument } from '../models/ticket.model';

export interface CreateTicketDto {
  title: string;
  price: number;
}

export interface CreateTicketResponse extends TicketDocument {}

export type GetTicketsResponse = TicketDocument[];

export interface UpdateTicketDto extends Partial<CreateTicketDto> {}

export type UpdateTicketResponse = CreateTicketResponse;
