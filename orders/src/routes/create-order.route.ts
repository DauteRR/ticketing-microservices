import {
  requireAuth,
  requestValidator,
  NotFoundError,
  OrderStatus,
  BadRequestError
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CreateOrderDto } from '../dtos/orders.dto';
import { Order } from '../models/order.model';
import { Ticket } from '../models/ticket.model';

export const createOrderRouter = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 15 * 60;

createOrderRouter.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .isMongoId()
      .withMessage('Wrong format, a MongoDB id was expected')
  ],
  requestValidator,
  async (req: Request<{}, {}, CreateOrderDto>, res: Response<{}>) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('POST', `/api/orders`);
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

    const order = Order.build({
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket,
      userId: req.currentUser!.id
    });

    await order.save();

    // TODO publish event

    res.status(201).send(order);
  }
);
