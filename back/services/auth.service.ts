import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import { AuthenticationError } from 'apollo-server-express';

import config from '../config';
import { User } from '../models/user.interface';

import UserService from './user.service';

const userService = new UserService();

export default class AuthService {
  async login(username: string, password: string): Promise<string | null> {
    const user = await userService.getUser(username);
    if (user) {
      const token = jsonwebtoken.sign(
        { username: user.username },
        config.tokenSecret,
        {
          expiresIn: '8h',
        },
      );
      if (user.password === password) {
        return token;
      }
      return null;
    }
    return null;
  }

  async getAuthUser(req: express.Request): Promise<{ user: User | null }> {
    const payload = req.headers.authorization?.split(' ') || [];
    const token = payload[1];
    let user: User | null = null;

    if (payload[0] === 'Bearer' && token) {
      try {
        const decoded = jsonwebtoken.verify(token, config.tokenSecret) as any;
        if (decoded?.username) {
          user = await userService.getUser(decoded.username);
        }
      } catch (err) {
        console.log(err);
      }
    }

    return { user };
  }

  async operationGuard<T>(
    context: { user: User },
    operation: Promise<T>,
  ): Promise<T> {
    if (context.user) {
      return operation;
    }
    throw new AuthenticationError('Not authorized');
  }
}
