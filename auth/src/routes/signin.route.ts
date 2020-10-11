import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requestValidator } from '../middlewares/request-validator.middleware';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  requestValidator,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as signinRouter };
