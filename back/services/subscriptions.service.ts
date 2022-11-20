import { PubSub } from 'graphql-subscriptions';

import { SubscriptionNameEnum } from '../models/enums/subscription-name.enum';
import { Comment } from '../models/interfaces/comment.interface';
import { HistoryEntry } from '../models/interfaces/history-entry.interface';

class SubscriptionsService {
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  publishCommentCreated(comment: Comment): void {
    this.pubSub.publish(SubscriptionNameEnum.CommentCreated, {
      commentCreated: comment,
    });
  }

  commentCreatedListener() {
    return this.pubSub.asyncIterator([SubscriptionNameEnum.CommentCreated]);
  }

  publishHistoryEntryAdded(historyEntry: HistoryEntry): void {
    this.pubSub.publish(SubscriptionNameEnum.HistoryEntryCreated, {
      historyEntryAdded: historyEntry,
    });
  }

  historyEntryAddedListener() {
    return this.pubSub.asyncIterator([
      SubscriptionNameEnum.HistoryEntryCreated,
    ]);
  }
}

export default new SubscriptionsService();
