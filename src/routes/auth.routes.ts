import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.models';
import { collections } from '../database';

export const usersRouter = express.Router();
usersRouter.use(express.json());
const router = express.Router();

usersRouter.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    await collections.users.insertOne({ email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed' });
  }
});

usersRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await collections.users.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      const token = jwt.sign({ email: user.email, userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({ token, expiresIn: 3600 }); // Token expires in 1 hour
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

export default router;
