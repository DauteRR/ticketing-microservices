import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requestValidator,
  requireAuth,
  UnauthorizedError
} from '@drrtickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../publishers/payment-created.publisher';
import { stripe } from '../stripe';

const router = Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  requestValidator,
  async (
    req: Request<{}, {}, { token: string; orderId: string }>,
    res: Response<{ id: string }>
  ) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError('POST', '/api/payments');
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token
    });

    const payment = Payment.build({
      chargeId: charge.id,
      orderId
    });
    await payment.save();

    const publisher = new PaymentCreatedPublisher(natsWrapper.client);
    publisher.publish({
      chargeId: payment.chargeId,
      id: payment.id,
      orderId: payment.orderId
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
