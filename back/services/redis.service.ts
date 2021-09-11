import jsonwebtoken from 'jsonwebtoken';
import { promisify } from 'util';

import config from '../config';
import redisClient from '../loaders/redis';
import { DecodedToken } from '../models/decoded-token.interface';

export default class RedisService {
  saveRevokedToken(token: string): void {
    const decoded = jsonwebtoken.verify(
      token,
      config.tokenSecret,
    ) as DecodedToken;
    const expiration = decoded.exp - decoded.iat;

    redisClient.setex(
      RedisService.getRedisKey(decoded),
      expiration,
      token,
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
  }

  async isTokenRevoked(
    payload: Pick<DecodedToken, 'userId' | 'id'>,
  ): Promise<boolean> {
    const redisGetPromise = promisify(redisClient.get).bind(redisClient);
    const revokedToken = await redisGetPromise(
      RedisService.getRedisKey(payload),
    );

    return !!revokedToken;
  }

  private static getRedisKey(
    payload: Pick<DecodedToken, 'userId' | 'id'>,
  ): string {
    return `${payload.userId}:${payload.id}`;
  }
}
