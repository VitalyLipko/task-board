import isUndefined from 'lodash/isUndefined';
import { LeanDocument, PopulateOptions } from 'mongoose';

import { taskModel, projectModel } from '../models/db.schema';
import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../models/task.interface';
import { User } from '../models/user.interface';

import LabelService from './label.service';
import UserService from './user.service';

const taskPopulateOptions: Array<PopulateOptions> = [
  {
    path: 'assignees',
    options: { sort: { firstName: 'asc' } },
  },
  { path: 'creator' },
  { path: 'labels', options: { sort: { title: 'asc' } } },
];
const labelService = new LabelService();
const userService = new UserService();

export default class TaskService {
  async getTasks(parentId: string): Promise<Array<Task>> {
    const tasks = await taskModel
      .find({ parentId })
      .populate(taskPopulateOptions);
    return tasks.map((task) => task.toJSON());
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await taskModel.findById(id).populate(taskPopulateOptions);
    return task ? task.toJSON() : null;
  }

  async createTask(
    task: CreateTaskInput,
    contextUser: User | undefined,
  ): Promise<Task> {
    const document = new taskModel({
      title: task.title,
      parentId: task.parentId,
      creator: contextUser,
    });

    if (task.description) {
      document.description = task.description;
    }

    if (task.assignees?.length) {
      document.assignees = await userService.getUsersForAssignees(
        task.assignees,
      );
    }

    if (task.labels?.length) {
      document.labels = await labelService.getTaskLabels(task.labels);
    }

    await document.save();

    const parent = await projectModel.findById(task.parentId);

    if (parent) {
      parent.tasks.push(document);
      await parent.save();
    }

    return document;
  }

  async updateTask(task: UpdateTaskInput): Promise<LeanDocument<Task> | null> {
    const prevTask = await taskModel.findById(task.id).populate('assignees');

    if (!prevTask) {
      return null;
    }

    if (task.assignees) {
      prevTask.assignees = await userService.getUsersForAssignees(
        task.assignees,
      );
    }

    if (task.labels) {
      prevTask.labels = await labelService.getTaskLabels(task.labels);
    }

    if (!isUndefined(task.title)) {
      prevTask.title = task.title;
    }

    if (!isUndefined(task.description)) {
      prevTask.description = task.description;
    }

    const curTask = await prevTask.save();
    await curTask.populate(taskPopulateOptions);

    return curTask.toJSON();
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await taskModel.findById(id);

    if (!task) {
      return false;
    }

    const project = await projectModel
      .findById(task.parentId)
      .populate('tasks', 'id');
    if (project) {
      project.tasks = project.tasks.filter((task) => task.id !== id);

      await project.save();
      await task.remove();
    }

    return true;
  }
}
