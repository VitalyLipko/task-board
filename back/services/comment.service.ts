import { ApolloError } from 'apollo-server-express';
import { PopulateOptions } from 'mongoose';

import {
  Comment,
  CreateCommentInput,
} from '../models/interfaces/comment.interface';
import { User } from '../models/interfaces/user.interface';
import { commentModel } from '../models/schemas/db.schema';

import subscriptionsService from './subscriptions.service';
import taskService from './task.service';

const commentPopulateOptions: Array<PopulateOptions> = [{ path: 'creator' }];
class CommentService {
  async createComment(
    comment: CreateCommentInput,
    contextUser: User | undefined,
  ): Promise<Comment> {
    const parentTask = await taskService.getTask(comment.parentId);

    if (!parentTask) {
      throw new ApolloError(`Parent task ${comment.parentId} not found`);
    }

    const document = new commentModel({
      parentId: comment.parentId,
      creator: contextUser,
      message: comment.message,
    });

    await document.save();
    await document.populate(commentPopulateOptions);

    subscriptionsService.publishCommentCreated(document);

    return document;
  }

  async getComments(parentId: string): Promise<Array<Comment>> {
    return commentModel.find({ parentId }).populate(commentPopulateOptions);
  }
}

export default new CommentService();
