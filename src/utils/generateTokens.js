import jwt from 'jsonwebtoken';

export function generateTokens(userId) {
  const payload = { id: userId };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  const accessTokenExp = Date.now() + 15 * 60 * 1000; // 15 хв
  const refreshTokenExp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 днів

  return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
}
