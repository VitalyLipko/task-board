import { promisify } from 'util';

import config from '../config';
import redisClient from '../loaders/redis';

export default class RedisService {
  saveRevokedToken(decodedToken: Record<string, string>, token: string): void {
    redisClient.setex(
      RedisService.getRedisKey(decodedToken),
      config.tokenExpireTime,
      token,
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
  }

  async isTokenRevoked(decodedToken: Record<string, string>): Promise<boolean> {
    const redisGetPromise = promisify(redisClient.get).bind(redisClient);
    const revokedToken = await redisGetPromise(
      RedisService.getRedisKey(decodedToken),
    );

    return !!revokedToken;
  }

  private static getRedisKey(payload: Record<string, string>): string {
    return `${payload.username}:${payload.id}`;
  }
}
