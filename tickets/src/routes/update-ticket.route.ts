import {
  requireAuth,
  requestValidator,
  NotFoundError,
  UnauthorizedError,
  BadRequestError
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

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    const { price, title } = req.body;

    const samePrice = price === undefined || price === ticket.price;
    const sameTitle = title === undefined || title === ticket.title;

    if (samePrice && sameTitle) {
      return res.send(ticket);
    }

    ticket.set(req.body);
    await ticket.save();

    const publisher = new TicketUpdatedPublisher(natsWrapper.client);

    const { userId, version } = ticket;

    publisher.publish({
      id,
      price: ticket.price,
      title: ticket.title,
      userId,
      version
    });

    res.send(ticket);
  }
);
