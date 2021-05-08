import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: process.env.PORT as string,
  databaseURL: process.env.DATABASE_URI as string,
  tokenSecret: process.env.TOKEN_SECRET as string,
};
