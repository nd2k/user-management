import config from './config/config';
import express from 'express';
import { userRoutes } from './routes/user.route';
import log from './utils/logger.util';
import connect from './database/connect';
import deserializeUser from './middlewares/deserializeUser';

const PORT: number = config.PORT;

const server = express();

server.use(express.json());
server.use(deserializeUser);

server.listen(PORT, async () => {
  log.info(`Server is running on port -- http://localhost:${PORT}`);
  await connect();
  userRoutes(server);
});
