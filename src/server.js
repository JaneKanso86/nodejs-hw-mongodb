import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/authenticate.js';
import swaggerUI from 'swagger-ui-express';

const PORT = getEnvVar('PORT') || 5543;

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(pinoHttp({ logger }));

  app.use('/photo', express.static(path.resolve('src/uploads/photo')));

  app.use('/auth', authRouter);
  app.use('/contacts', auth, contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    logger.info(`Server started on port ${PORT}`);
  });
};
