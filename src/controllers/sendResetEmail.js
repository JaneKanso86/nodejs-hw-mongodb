import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import * as userService from '../../models/user.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // створення JWT токена (життя 5 хв)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const html = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email sent',
    });
  } catch (error) {
    console.error(error.message);
    throw createHttpError(500, 'Email sending failed');
  }
};
