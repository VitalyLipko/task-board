import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { DecodedToken } from 'back/models/interfaces/decoded-token.interface';
import { Request, Response } from 'express';
import { Context } from 'graphql-ws';
import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import { ContextPayload } from '../models/interfaces/context-payload.interface';
import { User } from '../models/interfaces/user.interface';

import passwordService from './password.service';
import redisService from './redis.service';
import userService from './user.service';

const JWT_COOKIE_NAME = 'JWT';

class AuthService {
  async login(
    username: string,
    password: string,
    res: Response,
  ): Promise<string | null> {
    const user = await userService.getUserByName(username);

    if (user) {
      const isPasswordCorrect = await passwordService.compare(
        password,
        user.password,
      );

      if (isPasswordCorrect) {
        const token = jsonwebtoken.sign(
          { userId: user.id, id: uuidv4() },
          config.tokenSecret,
          {
            expiresIn: config.tokenExpireTime,
          },
        );
        res.cookie(JWT_COOKIE_NAME, token, { httpOnly: true });
        return token;
      }
    }

    throw new ApolloError('Invalid username or password');
  }

  async logout(
    id: string,
    token: string | undefined,
    res: Response,
  ): Promise<boolean> {
    if (!token) {
      return false;
    }

    const user = await userService.getUser(id);
    if (user) {
      await redisService.saveRevokedToken(token);
      res.clearCookie(JWT_COOKIE_NAME);
    }

    return !!user;
  }

  async createContext(req: Request): Promise<{ user?: User; token?: string }> {
    let user: User | undefined;
    let token: string | undefined;

    if (req.body?.operationName !== 'IntrospectionQuery') {
      const payload = req.headers.authorization?.split(' ') || [];
      token =
        payload[0] === 'Bearer' ? payload[1] : req.cookies[JWT_COOKIE_NAME];

      if (token) {
        try {
          const decoded = jsonwebtoken.verify(
            token,
            config.tokenSecret,
          ) as DecodedToken;

          if (decoded?.userId) {
            const result = await userService.getUser(decoded.userId);

            if (result) {
              const isTokenRevoked = await redisService.isTokenRevoked({
                userId: decoded.userId,
                id: decoded.id,
              });

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

  async checkWSConnection(
    ctx: Context<Record<string, unknown>, Record<string, unknown>>,
  ): Promise<boolean> {
    const { extra, connectionParams } = ctx;
    const authorization: string | undefined =
      connectionParams?.authorization as string;
    const payload =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      extra.request.headers.cookie?.split(`${JWT_COOKIE_NAME}=`) ||
      authorization?.split('Bearer ') ||
      [];
    const token: string | undefined = payload[1];
    let allChecksPassed = false;

    if (token) {
      try {
        const decoded = jsonwebtoken.verify(
          token,
          config.tokenSecret,
        ) as DecodedToken;

        if (decoded?.userId) {
          const result = await userService.getUser(decoded.userId);

          if (result) {
            allChecksPassed = !(await redisService.isTokenRevoked({
              userId: decoded.userId,
              id: decoded.id,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!token || !allChecksPassed) {
      throw new Error('Not authenticated');
    }

    return true;
  }

  isLoggedIn(partialContext: Pick<ContextPayload, 'user' | 'token'>): boolean {
    return !!(partialContext.user && partialContext.token);
  }

  async operationGuard<T>(
    context: ContextPayload,
    operation: () => Promise<T>,
  ): Promise<T> {
    if (this.isLoggedIn({ user: context.user, token: context.token })) {
      return operation();
    }
    throw new AuthenticationError('Not authenticated');
  }
}

export default new AuthService();
