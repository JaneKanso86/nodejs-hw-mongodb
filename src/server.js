import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import * as userModel from '../models/user.js';
import * as sessionService from './session.js';
import { generateTokens } from './session.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw createError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }

  // Delete previous session(s)
  await sessionService.deleteSessionByUserId(user._id);

  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    generateTokens(user._id);

  await sessionService.saveSession({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessTokenExp,
    refreshTokenValidUntil: refreshTokenExp,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
  const session =
    await sessionService.findSessionByRefreshToken(oldRefreshToken);
  if (!session) {
    throw createError(401, 'Invalid or expired refresh token');
  }

  await sessionService.deleteSessionById(session._id);

  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    generateTokens(session.userId);

  await sessionService.saveSession({
    userId: session.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessTokenExp,
    refreshTokenValidUntil: refreshTokenExp,
  });

  return { accessToken, refreshToken };
};

export const getSessionByRefreshToken = async (refreshToken) => {
  return await sessionService.findSessionByRefreshToken(refreshToken);
};

export const removeSession = async (sessionId) => {
  await sessionService.deleteSessionById(sessionId);
};
