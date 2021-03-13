import express, { Request, Response } from 'express';
import { GetTicketsResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';

export const getTicketsRouter = express.Router();

getTicketsRouter.get(
  '/api/tickets',
  async (req: Request, res: Response<GetTicketsResponse>) => {
    const tickets = await Ticket.find({
      orderId: undefined
    });
    res.send(tickets);
  }
);
