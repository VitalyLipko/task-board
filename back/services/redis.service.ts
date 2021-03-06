import jsonwebtoken from 'jsonwebtoken';

import config from '../config';
import redisClient from '../loaders/redis';
import { DecodedToken } from '../models/interfaces/decoded-token.interface';

class RedisService {
  async saveRevokedToken(token: string): Promise<void> {
    const decoded = jsonwebtoken.verify(
      token,
      config.tokenSecret,
    ) as DecodedToken;
    const expiration = decoded.exp - decoded.iat;

    await redisClient
      .setEx(RedisService.getRedisKey(decoded), expiration, token)
      .catch((err) => console.error(err));
  }

  async isTokenRevoked(
    payload: Pick<DecodedToken, 'userId' | 'id'>,
  ): Promise<boolean> {
    const token = await redisClient.get(RedisService.getRedisKey(payload));
    return !!token;
  }

  private static getRedisKey(
    payload: Pick<DecodedToken, 'userId' | 'id'>,
  ): string {
    return `${payload.userId}:${payload.id}`;
  }
}

export default new RedisService();
