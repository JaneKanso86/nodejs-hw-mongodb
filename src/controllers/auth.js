import { logoutUser, refreshSession, registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { resetPassword } from '../services/resetPassword.js';
import { sendResetEmailService } from '../services/sendResetEmail.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const refreshUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession({ sessionId, refreshToken });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Session refreshed successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export async function sendResetEmail(req, res) {
  await sendResetEmailService(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
}
export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  await resetPassword({ token, password });
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
