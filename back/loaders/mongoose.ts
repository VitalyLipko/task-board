import mongoose from 'mongoose';

import config from '../config';

export default async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.dbURI);
};
