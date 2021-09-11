import { LeanDocument, PopulateOptions } from 'mongoose';

import { projectModel, ProjectModel } from '../models/db.schema';
import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../models/project.interface';

const projectPopulateOptions: PopulateOptions = {
  path: 'tasks',
  populate: {
    path: 'assignees',
    options: { sort: { firstName: 'asc' } },
  },
  options: { sort: { title: 'asc' } },
};

export default class ProjectService {
  async createProject(
    project: CreateProjectInput,
  ): Promise<LeanDocument<ProjectModel>> {
    const res = await projectModel.create(project);

    return res.toJSON();
  }

  async updateProject(
    project: UpdateProjectInput,
  ): Promise<LeanDocument<ProjectModel> | null> {
    const document = await projectModel.findById(project.id);

    if (document && project.name) {
      document.name = project.name;
      const res = await document.save();
      return res.toJSON();
    }

    return null;
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
