import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { SignInDto } from '../dtos/signin.dto';
import { BadRequestError, requestValidator } from '@drrtickets/common';
import { User } from '../models/user.model';
import { PasswordUtils } from '../utils/password.utils';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  requestValidator,
  async (req: Request<{}, {}, SignInDto>, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordUtils.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
