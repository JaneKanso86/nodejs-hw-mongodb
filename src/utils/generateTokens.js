import crypto from 'node:crypto';

export const generateTokens = (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  const accessTokenExp = new Date(Date.now() + 10 * 60 * 1000); // 10 хв
  const refreshTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 год

  return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
};
