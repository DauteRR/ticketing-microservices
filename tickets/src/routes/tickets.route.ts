import { requestValidator, requireAuth } from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
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

export { router as ticketsRouter };
