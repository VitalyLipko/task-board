import express from 'express';

import { User } from './user.interface';

export interface ContextPayload {
  res: express.Response;
  user?: User;
  token?: string;
}
