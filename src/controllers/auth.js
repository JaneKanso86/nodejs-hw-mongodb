import * as authService from '../services/auth.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await authService.loginUser({
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};
export const refreshSession = async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).json({
      status: 401,
      message: 'Refresh token missing',
    });
  }

  const { accessToken, refreshToken } =
    await authService.refreshSession(oldRefreshToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};
export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.user;
    const token = req.cookies?.refreshToken;

    if (!sessionId || !token) {
      throw createError(401, 'Not authorized');
    }

    await authService.removeSession(sessionId);
    res.clearCookie('refreshToken');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
