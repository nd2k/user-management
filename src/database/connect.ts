import mongoose from 'mongoose';
import config from '../config/config';
import log from '../utils/logger.util';

const connect = async () => {
  const MONGO_URI = config.MONGO_URI;

  return mongoose
    .connect(MONGO_URI)
    .then(() => {
      log.info('Connected to MongoDb...');
    })
    .catch((e: any) => {
      log.error('Cannot connect to MongoDb...');
      process.exit(1);
    });
};

export default connect;
