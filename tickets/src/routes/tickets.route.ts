import {
  NotFoundError,
  requestValidator,
  requireAuth
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { CreateTicketDto, CreateTicketResponse } from '../dtos/tickets.dto';
import { Ticket } from '../models/ticket.model';

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

export { router as ticketsRouter };
