import isUndefined from 'lodash/isUndefined';
import mongoose, { LeanDocument, PopulateOptions } from 'mongoose';

import { taskModel, projectModel } from '../models/db.schema';
import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../models/task.interface';
import { User } from '../models/user.interface';

import LabelService from './label.service';
import UserService from './user.service';

const { Types } = mongoose;
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
    const objectId = new Types.ObjectId(parentId);
    return taskModel.find({ parentId: objectId }).populate(taskPopulateOptions);
  }

  async getTask(id: string): Promise<Task | null> {
    return taskModel.findById(id).populate(taskPopulateOptions);
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
    await document.populate(taskPopulateOptions);

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
    return curTask.populate(taskPopulateOptions);
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
      project.tasks = project.tasks.filter((task) => task && task.id !== id);

      await project.save();
      await task.remove();
    }

    return true;
  }
}
