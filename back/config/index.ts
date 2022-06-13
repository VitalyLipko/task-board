import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

expand(envFound);

export default {
  host: process.env.HOST as string,
  port: process.env.PORT as string,
  dbAdminUsername: process.env.DB_ADMIN_USERNAME as string,
  dbAdminPassword: process.env.DB_ADMIN_PASSWORD as string,
  dbURI: process.env.DB_URI as string,
  tokenSecret: process.env.TOKEN_SECRET as string,
  tokenExpireTime: Number(process.env.TOKEN_EXPIRE_TIME),
  appDataPath: process.env.APP_DATA_PATH as string,
  fileStoragePath: process.env.FILE_STORAGE_PATH as string,
};
