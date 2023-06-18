import mongoose from 'mongoose';

import Config from './config';

/**
 * Sets up the Mongoose connection to the MongoDB database.
 * @returns A Promise that resolves once the connection is established.
 */
export const setupMongoose = async (): Promise<void> => {
  const mongoDB = Config.mongoDB;

  if (mongoDB) {
    console.info(`setupMongoose: Starting Mongoose with connection URL ${mongoDB.url}${mongoDB.db}.`);
    mongoose.set('strictQuery', true);
    await mongoose.connect(`${mongoDB.url}${mongoDB.db}`);
    console.info(`setupMongoose: Successfully connected to ${mongoDB.url}${mongoDB.db}.`);
  }
};
