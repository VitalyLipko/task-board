import { ApolloError, AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import { ContextPayload } from '../models/context-payload.interface';
import { User } from '../models/user.interface';

import RedisService from './redis.service';
import UserService from './user.service';

const userService = new UserService();
const redisService = new RedisService();

export default class AuthService {
  async login(
    username: string,
    password: string,
    res: express.Response,
  ): Promise<string | null> {
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
        res.cookie('JWT', token, { httpOnly: true });
        return token;
      }
    }

    throw new ApolloError('Invalid username or password');
  }

  async logout(username: string, token?: string): Promise<boolean> {
    if (!token) {
      return false;
    }

    const user = await userService.getUser(username);

    if (user) {
      const decoded = jsonwebtoken.verify(token, config.tokenSecret) as Record<
        string,
        string
      >;
      redisService.saveRevokedToken(decoded, token);
    }

    return !!user;
  }

  async createContext(
    req: express.Request,
  ): Promise<{ user?: User; token?: string }> {
    let user: User | undefined;
    let token: string | undefined;

    if (req.body.operationName !== 'IntrospectionQuery') {
      const payload = req.headers.authorization?.split(' ') || [];
      token = payload[0] === 'Bearer' ? payload[1] : req.cookies['JWT'];

      if (token) {
        try {
          const decoded = jsonwebtoken.verify(
            token,
            config.tokenSecret,
          ) as Record<string, string>;

          if (decoded?.username) {
            const result = await userService.getUser(decoded.username);

            if (result) {
              const isTokenRevoked = await redisService.isTokenRevoked(decoded);

              if (isTokenRevoked) {
                return { user: result };
              }

              user = result;
            }
          }
        } catch (err) {
          console.error(err);
        }
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
    if (this.isLoggedIn(context)) {
      return operation();
    }
    throw new AuthenticationError('Not authenticated');
  }
}
