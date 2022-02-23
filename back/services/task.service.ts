import { ApolloError } from 'apollo-server-express';
import isUndefined from 'lodash/isUndefined';
import mongoose, {
  LeanDocument,
  PopulateOptions,
  QuerySelector,
} from 'mongoose';

import { TaskModel, taskModel } from '../models/db.schema';
import { TaskStatusEnum } from '../models/task-status.enum';
import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../models/task.interface';
import { User } from '../models/user.interface';

import LabelService from './label.service';
import ProjectService from './project.service';
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
const statusQuerySelectorDefault: QuerySelector<TaskStatusEnum> = {
  $not: { $eq: TaskStatusEnum.Deleted },
};
const labelService = new LabelService();
const userService = new UserService();

export default class TaskService {
  async getTasks(parentId: string): Promise<Array<Task>> {
    const objectId = new Types.ObjectId(parentId);
    return taskModel
      .find({ parentId: objectId, status: statusQuerySelectorDefault })
      .populate(taskPopulateOptions);
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await taskModel.findOne({
      id,
      status: statusQuerySelectorDefault,
    });
    if (task) {
      return task.populate(taskPopulateOptions);
    }
    throw new ApolloError(`Task ${id} not found`);
  }

  async createTask(
    task: CreateTaskInput,
    contextUser: User | undefined,
  ): Promise<Task> {
    const parentIdString = task.parentId.toString();
    const parent = await ProjectService.findActiveProject(parentIdString);
    if (!parent) {
      throw new ApolloError(`Parent project ${parentIdString} not found`);
    }

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

    parent.tasks.push(document);
    await parent.save();

    return document;
  }

  async updateTask(task: UpdateTaskInput): Promise<LeanDocument<Task> | null> {
    const prevTask = await taskModel.findById(task.id).populate('assignees');

    if (!prevTask) {
      throw new ApolloError(`Task ${task.id} not found`);
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

  async changeStatus(id: string, value: TaskStatusEnum): Promise<boolean> {
    const task = await taskModel.findById(id);
    if (!task) {
      throw new ApolloError(`Task ${id} not found`);
    }

    if (task.status === value || task.status === TaskStatusEnum.Deleted) {
      throw new ApolloError('Action not allowed');
    }

    switch (value) {
      case TaskStatusEnum.Deleted:
        return this.deleteTask(task);
      case TaskStatusEnum.Closed:
      case TaskStatusEnum.Open:
        task.status = value;
        await task.save();
        return true;
      default:
        return false;
    }
  }

  private async deleteTask(task: TaskModel): Promise<boolean> {
    const parentIdString = task.parentId.toString();
    const project = await ProjectService.findActiveProject(
      parentIdString,
    ).populate('tasks', 'id');
    if (project) {
      project.tasks = project.tasks.filter(
        (item) => item && item.id !== task.id,
      );
      await project.save();

      task.status = TaskStatusEnum.Deleted;
      await task.save();
      return true;
    }
    throw new ApolloError(`Parent project ${parentIdString} not found`);
  }
}
