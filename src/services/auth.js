import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import bcrypt from 'bcryptjs';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    email: newUser.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};
export const refreshSession = async (oldRefreshToken) => {
  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const existingSession = await Session.findOne({ userId: payload.userId });

  if (!existingSession || existingSession.refreshToken !== oldRefreshToken) {
    throw createError(403, 'Refresh token is not valid or session expired');
  }

  await Session.findOneAndDelete({ userId: payload.userId });

  const newAccessToken = jwt.sign(
    { userId: payload.userId },
    JWT_ACCESS_SECRET,
    {
      expiresIn: '15m',
    },
  );

  const newRefreshToken = jwt.sign(
    { userId: payload.userId },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    },
  );

  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: payload.userId,
    refreshToken: newRefreshToken,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
export const removeSession = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};
