import mongoose from 'mongoose';
import pc from 'picocolors';

import Config from './config';

/**
 * Sets up the Mongoose connection to the MongoDB database.
 * @returns A Promise that resolves once the connection is established.
 */
export const setupMongoose = async (): Promise<void> => {
  if (Config.mongoDB.enabled) {
    console.log(
      `${pc.green('[MongoDB enabled] ')}${pc.blue('Startup:')} Starting Mongoose with connection URL ${Config.mongoDB.url}${Config.mongoDB.db}.`,
    );
    mongoose.set('strictQuery', true);
    await mongoose.connect(`${Config.mongoDB.url}${Config.mongoDB.db}`);
    console.log(`${pc.green('[MongoDB enabled] ')}${pc.blue('Startup:')} Successfully connected to ${Config.mongoDB.url}${Config.mongoDB.db}.`);
  }
};
