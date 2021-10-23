import { PopulatedDoc } from 'mongoose';

import { Label } from './label.interface';
import { User } from './user.interface';

export interface Task {
  id: string;
  created: Date;
  title: string;
  description?: string;
  parentId: string;
  assignees: Array<PopulatedDoc<User>>;
  creator: User;
  isOpen: boolean;
  labels: Array<PopulatedDoc<Label>>;
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
