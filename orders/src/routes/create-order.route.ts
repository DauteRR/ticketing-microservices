import express, { Request, Response } from 'express';

export const createOrderRouter = express.Router();

createOrderRouter.post(
  '/api/orders',
  async (req: Request<{}, {}, {}>, res: Response<{}>) => {
    res.status(200).send({});
  }
);
