import { ApolloError } from 'apollo-server-express';
import isUndefined from 'lodash/isUndefined';
import { LeanDocument, PopulateOptions } from 'mongoose';

import { ProjectStatusEnum } from '../models/enums/project-status.enum';
import { TaskStatusEnum } from '../models/enums/task-status.enum';
import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../models/interfaces/project.interface';
import {
  projectModel,
  ProjectModel,
  taskModel,
} from '../models/schemas/db.schema';

import fileStorageService from './file-storage.service';

const projectPopulateOptions: PopulateOptions = {
  path: 'tasks',
  populate: [
    {
      path: 'assignees',
      options: { sort: { firstName: 'asc' } },
    },
    { path: 'labels', options: { sort: { title: 'asc' } } },
    {
      path: 'creator',
    },
  ],
  options: { sort: { title: 'asc' } },
};

export class ProjectService {
  async createProject(
    project: CreateProjectInput,
  ): Promise<LeanDocument<ProjectModel>> {
    const document = new projectModel({ name: project.name });
    if (project.icon) {
      document.icon = await fileStorageService.save(project.icon);
    }

    return document.save();
  }

  async updateProject(
    project: UpdateProjectInput,
  ): Promise<LeanDocument<ProjectModel> | null> {
    const document = await ProjectService.findActiveProject(project.id);

    if (!document) {
      throw new ApolloError(`Project ${project.id} not found`);
    }

    if (project.name) {
      document.name = project.name;
    }

    if (!isUndefined(project.icon)) {
      if (project.icon === null && document.icon) {
        await fileStorageService.delete(document.icon.url);
        document.icon = project.icon;
      } else if (project.icon && document.icon) {
        await fileStorageService.delete(document.icon.url);
        document.icon = await fileStorageService.save(project.icon);
      } else {
        document.icon = await fileStorageService.save(project.icon);
      }
    }

    return document.save();
  }

  async getProjects(): Promise<Array<LeanDocument<Project>>> {
    return projectModel
      .find({ status: ProjectStatusEnum.Active }, null, {
        sort: { name: 'asc' },
      })
      .populate(projectPopulateOptions);
  }

  async getProject(id: string): Promise<LeanDocument<Project> | null> {
    const document = await ProjectService.findActiveProject(id);
    if (document) {
      return document.populate(projectPopulateOptions);
    }

    throw new ApolloError(`Project ${id} not found`);
  }

  async deleteProject(id: string): Promise<boolean> {
    const project = await ProjectService.findActiveProject(id);
    if (project) {
      project.status = ProjectStatusEnum.Deleted;
      await project.save();
      await taskModel.updateMany(
        { parentId: id },
        { status: TaskStatusEnum.Deleted },
      );
      return true;
    }
    return false;
  }

  static findActiveProject(id: string) {
    return projectModel.findOne({ id, status: ProjectStatusEnum.Active });
  }
}

export default new ProjectService();
