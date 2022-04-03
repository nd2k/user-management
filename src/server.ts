import config from './config/config';
import express from 'express';
import { identificationRoutes } from './routes/identification';
import log from './utils/logger';
import connect from './database/connect';

const PORT: number = config.PORT;

const server = express();
server.use(express.json());

server.listen(PORT, async () => {
  log.info(`Server is running on port -- http://localhost:${PORT}`);
  await connect();
  identificationRoutes(server);
});
