import { requireAuth } from '@drrtickets/common';
import express, { Request, Response } from 'express';
import { Order, OrderDocument } from '../models/order.model';

export const getOrdersRoute = express.Router();

getOrdersRoute.get(
  '/api/orders',
  requireAuth,
  async (req: Request<{}, {}, {}>, res: Response<OrderDocument[]>) => {
    const orders = await Order.find({
      userId: req.currentUser!.id
    }).populate('ticket');

    res.status(200).send(orders);
  }
);
