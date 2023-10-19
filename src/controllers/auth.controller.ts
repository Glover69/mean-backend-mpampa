// // auth.controller.ts
// import { Request, Response } from 'express';
// import bcrypt from "bcrypt";
// import users from '../models/user.models';

// export const register = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new users({ email, password: hashedPassword });
//   await user.save();
//   res.json({ message: 'Registration successful!' });
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await users.findOne({ email });
//   if (user && await bcrypt.compare(password, user.password)) {
//     res.json({ message: 'Login successful!' });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };
