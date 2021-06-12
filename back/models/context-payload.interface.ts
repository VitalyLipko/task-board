import { User } from './user.interface';

export interface ContextPayload {
  user: User | null;
  token?: string;
}
