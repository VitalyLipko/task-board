import { Types, PopulatedDoc } from 'mongoose';

import { TaskStatusEnum } from '../enums/task-status.enum';

import { Label } from './label.interface';
import { User } from './user.interface';

export interface Task {
  id: string;
  created: Date;
  title: string;
  description?: string;
  parentId: Types.ObjectId;
  assignees: Array<PopulatedDoc<User>>;
  creator: PopulatedDoc<User>;
  labels: Array<PopulatedDoc<Label>>;
  status: TaskStatusEnum;
  commentCount: number;
}

export interface CreateTaskInput {
  title: Task['title'];
  description: Task['description'];
  parentId: Task['parentId'];
  assignees?: Array<User['id']>;
  labels?: Array<Label['id']>;
}

export interface UpdateTaskInput {
  id: Task['id'];
  title?: Task['title'];
  description?: Task['description'];
  assignees?: Array<User['id']>;
  labels?: Array<Label['id']>;
}
