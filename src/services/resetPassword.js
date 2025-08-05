import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';

const { JWT_SECRET } = process.env;

export const resetPassword = async ({ token, password }) => {
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  user.refreshTokens = [];

  await user.save();
};
