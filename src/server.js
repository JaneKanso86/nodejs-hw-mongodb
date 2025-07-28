import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter);

  app.get('/', (req, res) => {
    res.send('API is running');
  });

  return app;
}
