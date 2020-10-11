import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  const token = req.session ? (req.session.jwt as string) ?? '' : '';

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
