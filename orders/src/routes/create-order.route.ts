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
import { Order, OrderDocument } from '../models/order.model';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../publishers/order-created.publisher';

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
  async (
    req: Request<{}, {}, CreateOrderDto>,
    res: Response<OrderDocument>
  ) => {
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

    const publisher = new OrderCreatedPublisher(natsWrapper.client);

    publisher.publish({
      id: order.id!,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id!,
        price: order.ticket.price
      }
    });

    res.status(201).send(order);
  }
);
