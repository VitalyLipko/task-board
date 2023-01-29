import { FileUpload } from 'graphql-upload/Upload';
import { PopulatedDoc } from 'mongoose';

import { ProjectStatusEnum } from '../enums/project-status.enum';

import { File } from './file.interface';
import { Task } from './task.interface';

export interface Project {
  id: string;
  created: Date;
  name: string;
  tasks: Array<PopulatedDoc<Task>>;
  status: ProjectStatusEnum;
  icon?: File;
}

export interface CreateProjectInput {
  name: Project['name'];
  icon?: FileUpload;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: Project['id'];
}
