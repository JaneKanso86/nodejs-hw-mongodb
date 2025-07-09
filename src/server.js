import express from 'express';
import pino from 'pino';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    return res.send('API is running');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`✅ Server is running on port ${PORT}`);
  });

  return app;
};
