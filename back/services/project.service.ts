import isUndefined from 'lodash/isUndefined';
import { LeanDocument, PopulateOptions } from 'mongoose';

import { projectModel, ProjectModel } from '../models/db.schema';
import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../models/project.interface';

import FileStorageService from './file-storage.service';

const projectPopulateOptions: PopulateOptions = {
  path: 'tasks',
  populate: {
    path: 'assignees',
    options: { sort: { firstName: 'asc' } },
  },
  options: { sort: { title: 'asc' } },
};

const fileStorageService = new FileStorageService();

export default class ProjectService {
  async createProject(
    project: CreateProjectInput,
  ): Promise<LeanDocument<ProjectModel>> {
    const document = new projectModel({ name: project.name });
    if (project.icon) {
      document.icon = await fileStorageService.save(project.icon);
    }

    const res = await document.save();

    return res.toJSON();
  }

  async updateProject(
    project: UpdateProjectInput,
  ): Promise<LeanDocument<ProjectModel> | null> {
    const document = await projectModel.findById(project.id);

    if (!document) {
      return null;
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

    const res = await document.save();
    return res.toJSON();
  }

  async getProjects(): Promise<Array<LeanDocument<Project>>> {
    const projects = await projectModel
      .find({}, null, { sort: { name: 'asc' } })
      .populate(projectPopulateOptions);
    return projects.map((project) => project.toJSON());
  }

  async getProject(id: string): Promise<LeanDocument<Project> | null> {
    const project = await projectModel
      .findById(id)
      .populate(projectPopulateOptions);
    return project ? project.toJSON() : null;
  }
}
