import express, { Request, Response } from 'express';

export const removeOrderRouter = express.Router();

removeOrderRouter.delete(
  '/api/orders/:orderId',
  async (req: Request<{}, {}, {}>, res: Response<{}>) => {
    res.status(200).send({});
  }
);
