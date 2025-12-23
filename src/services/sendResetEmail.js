import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_LOGIN,
  SMTP_PASSWORD,
  SMTP_FROM,
  JWT_SECRET,
  APP_DOMAIN,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_PASSWORD,
  },
});

export const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  console.log('[DEBUG] Reset Token:', token);
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: SMTP_FROM || SMTP_LOGIN,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 5 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email error:', err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
