import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

const { JWT_ACCESS_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createError(401, 'Not authorized');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid token');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session not found');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = { ...user.toObject(), sessionId: session._id };
    next();
  } catch (error) {
    next(error);
  }
};
