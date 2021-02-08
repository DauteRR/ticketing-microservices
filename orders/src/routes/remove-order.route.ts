import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthorizedError
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { Order, OrderDocument } from '../models/order.model';
import { natsWrapper } from '../nats-wrapper';
import { OrderCanceledPublisher } from '../publishers/order-canceled.publisher';

export const removeOrderRouter = express.Router();

removeOrderRouter.delete(
  '/api/orders/:orderId',
  [
    param('id')
      .isMongoId()
      .withMessage('Wrong format, a MongoDB id was expected')
  ],
  requireAuth,
  async (
    req: Request<
      {
        orderId: string;
      },
      {},
      {}
    >,
    res: Response<OrderDocument>
  ) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError('DELETE', `/api/orders/${req.params.orderId}`);
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Canceled;

    await order.save();

    const publisher = new OrderCanceledPublisher(natsWrapper.client);

    publisher.publish({
      id: order.id!,
      ticket: {
        id: order.ticket.id!
      }
    });

    res.status(204).send(order);
  }
);
