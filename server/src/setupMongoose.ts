import mongoose from 'mongoose';

import Config from './config';

/**
 * Sets up the Mongoose connection to the MongoDB database.
 * @returns A Promise that resolves once the connection is established.
 */
export const setupMongoose = async (): Promise<void> => {
  const mongoDBConfig = Config.mongoDB;

  console.info(`setupMongoose: Starting Mongoose with connection URL ${mongoDBConfig.url}${mongoDBConfig.db}.`);
  mongoose.set('strictQuery', true);
  await mongoose.connect(`${mongoDBConfig.url}${mongoDBConfig.db}`);
  console.info(`setupMongoose: Successfully connected to ${mongoDBConfig.url}${mongoDBConfig.db}.`);
};
