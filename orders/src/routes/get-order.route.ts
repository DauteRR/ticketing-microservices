import express, { Request, Response } from 'express';

export const getOrderRoute = express.Router();

getOrderRoute.get(
  '/api/orders/:orderId',
  async (req: Request<{}, {}, {}>, res: Response<{}>) => {
    res.status(200).send({});
  }
);
