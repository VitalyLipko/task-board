import { RedisClient } from 'redis';

export let redisClient: RedisClient;
export default async (): Promise<RedisClient> => {
  const redisInstance = (redisClient = new RedisClient({}));

  return redisInstance;
};
