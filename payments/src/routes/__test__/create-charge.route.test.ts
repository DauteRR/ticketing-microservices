import request from 'supertest';
import { app } from '../../app';
import { mongo } from 'mongoose';
import { OrderStatus, Subject } from '@drrtickets/common';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

describe('Charge creation: POST /api/payments', () => {
  it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.getAuthCookie('test@test.test'))
      .send({
        token: '12312',
        orderId: new mongo.ObjectID().toHexString()
      })
      .expect(404);
  });

  it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build(new mongo.ObjectID().toHexString(), {
      price: 100,
      status: OrderStatus.Created,
      userId: new mongo.ObjectID().toHexString(),
      version: 0
    });
    await order.save();
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.getAuthCookie('test@test.test'))
      .send({
        token: '12312',
        orderId: order.id
      })
      .expect(401);
  });

  it('returns a 400 when purchasing a canceled order', async () => {
    const userId = new mongo.ObjectID().toHexString();

    const order = Order.build(new mongo.ObjectID().toHexString(), {
      price: 100,
      status: OrderStatus.Canceled,
      userId,
      version: 0
    });
    await order.save();
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.getAuthCookie(userId))
      .send({
        token: '12312',
        orderId: order.id
      })
      .expect(400);
  });

  it('returns a 201 with valid inputs', async () => {
    const userId = new mongo.ObjectID().toHexString();

    const order = Order.build(new mongo.ObjectID().toHexString(), {
      price: 100,
      status: OrderStatus.Created,
      userId,
      version: 0
    });
    await order.save();
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.getAuthCookie(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id
      })
      .expect(201);

    expect(stripe.charges.create).toHaveBeenCalled();

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
      orderId: order.id
    });

    expect(payment).toBeDefined();
  });
});
