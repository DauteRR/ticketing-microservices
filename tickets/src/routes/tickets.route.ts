import {
  NotFoundError,
  requestValidator,
  requireAuth,
  UnauthorizedError
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import {
  CreateTicketDto,
  CreateTicketResponse,
  GetTicketsResponse,
  UpdateTicketDto,
  UpdateTicketResponse
} from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../publishers/ticket-created.publisher';

const router = express.Router();

router.post(
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

router.get(
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

router.get(
  '/api/tickets',
  async (req: Request, res: Response<GetTicketsResponse>) => {
    const tickets = await Ticket.find();
    res.send(tickets);
  }
);

router.put(
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

    res.send(ticket);
  }
);

export { router as ticketsRouter };
