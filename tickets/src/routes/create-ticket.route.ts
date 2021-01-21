import { requireAuth, requestValidator } from '@drrtickets/common';
import { body } from 'express-validator';
import { CreateTicketDto, CreateTicketResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../publishers/ticket-created.publisher';
import express, { Request, Response } from 'express';

export const createTicketRouter = express.Router();

createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price should be greatest than zero')
  ],
  requestValidator,
  async (
    req: Request<{}, {}, CreateTicketDto>,
    res: Response<CreateTicketResponse>
  ) => {
    const { price, title } = req.body;

    const ticket = Ticket.build({
      price,
      title,
      userId: req.currentUser!.id
    });

    const ticketDocument = await ticket.save();

    const publisher = new TicketCreatedPublisher(natsWrapper.client);

    publisher.publish({
      id: ticketDocument.id,
      ...ticketDocument
    });

    res.status(201).send(ticketDocument);
  }
);
