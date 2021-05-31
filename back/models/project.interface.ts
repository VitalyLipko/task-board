import { Task } from './task.interface';

export interface Project {
  id: string;
  created: Date;
  name: string;
  tasks: Array<Task>;
}

export interface CreateProjectInput {
  name: Project['name'];
}

export interface UpdateProjectInput {
  id: Project['id'];
  name?: Project['name'];
}
