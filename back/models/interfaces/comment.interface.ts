import { PopulatedDoc, Types } from 'mongoose';

import { User } from './user.interface';

export interface Comment {
  id: string;
  parentId: Types.ObjectId;
  created: Date;
  creator: PopulatedDoc<User>;
  message: string;
}

export interface CreateCommentInput {
  parentId: string;
  message: Comment['message'];
}
