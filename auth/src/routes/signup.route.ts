import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SignUpDto } from '../dtos/signup.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { RequestValidationError } from '../errors/request-validation.error';
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
  async (req: Request<{}, {}, SignUpDto>, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

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

    // TODO return a cookie or jwt
    res.status(201).send({ email: user.email, id: user._id });
  }
);

export { router as signupRouter };
