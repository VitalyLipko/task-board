import { FileUpload } from 'graphql-upload';
import { PopulatedDoc } from 'mongoose';

import { File } from './file.interface';
import { Task } from './task.interface';

export interface Project {
  id: string;
  created: Date;
  name: string;
  tasks: Array<PopulatedDoc<Task>>;
  icon?: File;
}

export interface CreateProjectInput {
  name: Project['name'];
  icon?: FileUpload;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: Project['id'];
}
