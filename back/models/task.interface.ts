import { Document } from 'mongoose';

export interface Task extends Document {
  id: string;
  created: Date;
  title: string;
  parentId: string;
}
