import {
  requireAuth,
  requestValidator,
  NotFoundError,
  UnauthorizedError
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { UpdateTicketDto, UpdateTicketResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher';

export const updateTicketRouter = express.Router();

updateTicketRouter.put(
  '/api/tickets/:id',
  requireAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('Wrong format, a MongoDB id was expected'),
    body('title').not().isEmpty().withMessage('Title is required').optional(),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price should be greatest than zero')
      .optional()
  ],
  requestValidator,
  async (
    req: Request<{ id: string }, {}, UpdateTicketDto>,
    res: Response<UpdateTicketResponse>
  ) => {
    const { id } = req.params;
    let ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError('PUT', `/api/tickets/${id}`);
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    ticket.set(req.body);
    await ticket.save();

    const publisher = new TicketUpdatedPublisher(natsWrapper.client);

    publisher.publish({
      id: ticket.id,
      ...ticket
    });

    res.send(ticket);
  }
);