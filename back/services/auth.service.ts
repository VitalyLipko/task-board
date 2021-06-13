import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import bcrypt from 'bcrypt';

import config from '../config';
import { ContextPayload } from '../models/context-payload.interface';
import { User } from '../models/user.interface';
import { redisClient } from '../loaders/redis';

import UserService from './user.service';

const userService = new UserService();

export default class AuthService {
  async login(username: string, password: string): Promise<string | null> {
    const user = await userService.getUser(username);

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const token = jsonwebtoken.sign(
          { username: user.username, id: uuidv4() },
          config.tokenSecret,
          {
            expiresIn: config.tokenExpireTime,
          },
        );
        return token;
      }
    }

    throw new ApolloError('Invalid username or password');
  }

  async logout(username: string, token?: string): Promise<boolean> {
    const user = await userService.getUser(username);

    if (user && token) {
      const decoded = jsonwebtoken.verify(token, config.tokenSecret) as any;

      redisClient.setex(
        this.getRedisKey(decoded),
        config.tokenExpireTime,
        token,
        (err) => {
          if (err) {
            console.error(err);
          }
        },
      );
      return true;
    }
    return false;
  }

  async getAuthUser(req: express.Request): Promise<ContextPayload> {
    const isIntrospectionQuery =
      req.body.operationName === 'IntrospectionQuery';
    const payload = req.headers.authorization?.split(' ') || [];
    const token = payload[1];
    let user: User | null = null;

    if (!isIntrospectionQuery && payload[0] === 'Bearer' && token) {
      try {
        const decoded = jsonwebtoken.verify(token, config.tokenSecret) as any;
        if (decoded?.username) {
          user = await userService.getUser(decoded.username);

          if (user) {
            const redisGetPromise = promisify(redisClient.get).bind(
              redisClient,
            );
            const revokedToken = await redisGetPromise(
              this.getRedisKey(decoded),
            );

            if (revokedToken) {
              return { user: null };
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    return { user, token };
  }

  isLoggedIn(context: ContextPayload): boolean {
    return !!(context.user && context.token);
  }

  async operationGuard<T>(
    context: ContextPayload,
    operation: () => Promise<T>,
  ): Promise<T> {
    if (context.user) {
      return operation();
    }
    throw new AuthenticationError('Not authenticated');
  }

  private getRedisKey(payload: { username: string; id: string }): string {
    return `${payload.username}:${payload.id}`;
  }
}
