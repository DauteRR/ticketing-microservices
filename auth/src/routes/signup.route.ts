import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { SignUpDto } from '../dtos/signup.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { requestValidator } from '../middlewares/request-validator.middleware';
import { User } from '../models/user.model';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  requestValidator,
  async (req: Request<{}, {}, SignUpDto>, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({
      email,
      password
    });

    await user.save();

    const userJwt = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
