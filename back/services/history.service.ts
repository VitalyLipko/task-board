import { HistoryEventEnum } from '../models/enums/history-event.enum';
import { HistoryEntry } from '../models/interfaces/history-entry.interface';
import { User } from '../models/interfaces/user.interface';
import { historyEntryModel } from '../models/schemas/db.schema';

import subscriptionsService from './subscriptions.service';

class HistoryService {
  async createEntry(
    event: HistoryEventEnum,
    parentId: string,
    user: User,
  ): Promise<void> {
    const document = new historyEntryModel({ event, parentId, user });
    await document.save();
    await document.populate('user');

    subscriptionsService.publishHistoryEntryAdded(document);
  }

  async getEntries(parentId: string): Promise<Array<HistoryEntry>> {
    return historyEntryModel.find({ parentId }).populate('user');
  }
}

export default new HistoryService();
