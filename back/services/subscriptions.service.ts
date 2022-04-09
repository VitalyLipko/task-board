import { PubSub } from 'graphql-subscriptions';

import { Comment } from '../models/interfaces/comment.interface';

export const COMMENT_CREATED_EVENT = 'COMMENT_CREATED';
class SubscriptionsService {
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  publishCommentCreated(comment: Comment): void {
    this.pubSub.publish(COMMENT_CREATED_EVENT, { commentCreated: comment });
  }

  commentCreatedListener() {
    return this.pubSub.asyncIterator([COMMENT_CREATED_EVENT]);
  }
}

export default new SubscriptionsService();
