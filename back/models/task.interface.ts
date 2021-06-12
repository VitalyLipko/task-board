import { PopulatedDoc } from 'mongoose';
import { User } from './user.interface';

export interface Task {
  id: string;
  created: Date;
  title: string;
  parentId: string;
  assignees: Array<PopulatedDoc<User>>;
}

export interface CreateTaskInput {
  title: Task['title'];
  parentId: Task['parentId'];
  assignees?: Array<Task['id']>;
}

export interface UpdateTaskInput {
  id: Task['id'];
  title?: Task['title'];
  assignees?: Array<Task['id']>;
}
