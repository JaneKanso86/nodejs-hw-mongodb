const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');
require('dotenv').config();

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();
