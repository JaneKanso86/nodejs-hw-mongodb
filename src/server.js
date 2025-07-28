import express from 'express';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);

  app.get('/', (req, res) => {
    res.send('API is running');
  });

  return app;
}
