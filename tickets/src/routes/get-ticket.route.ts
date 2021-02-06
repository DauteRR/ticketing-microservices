import { NotFoundError, requestValidator } from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { CreateTicketResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';

export const getTicketRouter = express.Router();

getTicketRouter.get(
  '/api/tickets/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Wrong format, a MongoDB id was expected')
  ],
  requestValidator,
  async (req: Request<{ id: string }>, res: Response<CreateTicketResponse>) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError('GET', `/api/tickets/${id}`);
    }

    res.send(ticket);
  }
);
