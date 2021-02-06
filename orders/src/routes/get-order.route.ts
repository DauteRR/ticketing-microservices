import {
  NotFoundError,
  requireAuth,
  UnauthorizedError
} from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { Order, OrderDocument } from '../models/order.model';

export const getOrderRoute = express.Router();

getOrderRoute.get(
  '/api/orders/:orderId',
  [
    param('id')
      .isMongoId()
      .withMessage('Wrong format, a MongoDB id was expected')
  ],
  requireAuth,
  async (
    req: Request<{ orderId: string }, {}, {}>,
    res: Response<OrderDocument>
  ) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError('GET', `/api/orders/${req.params.orderId}`);
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    res.status(200).send(order);
  }
);
