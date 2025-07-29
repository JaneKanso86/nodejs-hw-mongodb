import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export async function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (typeof authorization !== 'string') {
      throw new createHttpError.Unauthorized('Please provide access token');
    }

    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
      throw new createHttpError.Unauthorized('Please provide access token');
    }

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw new createHttpError.Unauthorized('Session not found');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw new createHttpError.Unauthorized('Access token is expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw new createHttpError.Unauthorized('User not found');
    }

    req.user = { id: user._id, name: user.name };
    next();
  } catch (error) {
    next(error);
  }
}
