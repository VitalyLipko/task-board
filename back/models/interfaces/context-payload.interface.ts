import { Response } from 'express';

import { User } from './user.interface';

export interface ContextPayload {
  res: Response;
  user?: User;
  token?: string;
}
