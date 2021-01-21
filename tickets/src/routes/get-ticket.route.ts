import express, { Request, Response } from 'express';
import { GetTicketsResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';

export const getTicketRouter = express.Router();

getTicketRouter.get(
  '/api/tickets',
  async (req: Request, res: Response<GetTicketsResponse>) => {
    const tickets = await Ticket.find();
    res.send(tickets);
  }
);
