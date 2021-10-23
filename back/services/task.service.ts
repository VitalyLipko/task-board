import isUndefined from 'lodash/isUndefined';
import { LeanDocument, PopulateOptions } from 'mongoose';

import { extractLabel } from '../../shared-utils/extract-label';
import { taskModel, projectModel } from '../models/db.schema';
import { Label } from '../models/label.interface';
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
      const users = await Promise.all(
        task.assignees.map((assignee) => userService.getUser(assignee)),
      );
      users.forEach((user) => {
        if (user) {
          document.assignees.push(user);
        }
      });
    }

    if (task.labels?.length) {
      const labels = await Promise.all(
        task.labels.map((label) => labelService.getLabel(label)),
      );
      labels.forEach((label) => {
        if (label) {
          document.labels.push(label);
        }
      });
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

    if (task.assignees?.length) {
      const users = await Promise.all(
        task.assignees.map((assignee) => userService.getUser(assignee)),
      );
      prevTask.assignees = [];
      users.forEach((user) => {
        if (user) {
          prevTask.assignees.push(user);
        }
      });
    } else if (task.assignees?.length === 0 && prevTask.assignees.length) {
      prevTask.assignees = [];
    }

    if (task.labels?.length) {
      const labels = await Promise.all(
        task.labels.map((label) => labelService.getLabel(label)),
      );
      const newLabels: Array<LeanDocument<Label>> = [];
      labels.forEach((label) => {
        if (label) {
          const { scope, title } = extractLabel(label.title);
          const alreadyHas = !!newLabels.find((i) => {
            const { scope: itemScope, title: itemTitle } = extractLabel(
              i.title,
            );
            return scope && itemScope
              ? scope === itemScope
              : itemTitle === title;
          });

          if (!alreadyHas) {
            newLabels.push(label);
          }
        }
      });
      prevTask.labels = newLabels;
    } else if (task.labels?.length === 0 && prevTask.labels.length) {
      prevTask.labels = [];
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
