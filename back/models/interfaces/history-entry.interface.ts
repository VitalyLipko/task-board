import { PopulatedDoc, Types } from 'mongoose';

import { HistoryEventEnum } from '../enums/history-event.enum';

import { User } from './user.interface';

export interface HistoryEntry {
  id: string;
  parentId: Types.ObjectId;
  created: Date;
  event: HistoryEventEnum;
  user: PopulatedDoc<User>;
}
