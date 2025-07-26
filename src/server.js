import express from 'express';
import pino from 'pino';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import contactsRouter from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routes/auth.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.get('/', (req, res) => {
    return res.send('API is running');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`✅ Server is running on port ${PORT}`);
  });

  return app;
};
