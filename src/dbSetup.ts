import mongoose from 'mongoose';
import { config } from '@root/configuration';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Database-Setup');

export const mongoDbConnect = () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
      .connect(config.MONGO_URI!)
      .then(() => {
        log.info('Database connected successfully');
      })
      .catch((error) => {
        log.error('Something went wrong', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
