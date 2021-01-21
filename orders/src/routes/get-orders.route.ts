import express, { Request, Response } from 'express';

export const getOrdersRoute = express.Router();

getOrdersRoute.get(
  '/api/orders',
  async (req: Request<{}, {}, {}>, res: Response<{}>) => {
    res.status(200).send({});
  }
);
