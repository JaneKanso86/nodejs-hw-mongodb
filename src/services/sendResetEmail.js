import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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

if (!SMTP_LOGIN || !SMTP_PASSWORD || !JWT_SECRET || !APP_DOMAIN) {
  console.error('Missing required environment variables!');
  throw new Error('Missing required environment variables.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_PASSWORD,
  },
  logger: true,
  debug: true,
});

const sendResetEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error(' User not found:', email);
      throw new Error('User not found');
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
      from: SMTP_FROM || SMTP_LOGIN,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Email sent successfully:', info.response);
  } catch (error) {
    console.error(' sendResetEmail() failed:');
    console.error('Message:', error.message);
    console.error('Full error:', error);
    throw new Error('Failed to send reset password email.');
  }
};

export default sendResetEmail;
