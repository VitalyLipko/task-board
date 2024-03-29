import { GraphQLError } from 'graphql/error';
import isUndefined from 'lodash/isUndefined';
import mongoose, {
  LeanDocument,
  PopulateOptions,
  QuerySelector,
} from 'mongoose';

import { HistoryEventEnum } from '../models/enums/history-event.enum';
import { TaskStatusEnum } from '../models/enums/task-status.enum';
import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../models/interfaces/task.interface';
import { User } from '../models/interfaces/user.interface';
import { TaskModel, taskModel } from '../models/schemas/db.schema';

import historyService from './history.service';
import labelService from './label.service';
import { ProjectService } from './project.service';
import userService from './user.service';

const { Types } = mongoose;
const taskPopulateOptions: Array<PopulateOptions> = [
  {
    path: 'assignees',
    options: { sort: { firstName: 'asc' } },
  },
  { path: 'creator' },
  { path: 'labels', options: { sort: { title: 'asc' } } },
];
export const statusQuerySelectorDefault: QuerySelector<TaskStatusEnum> = {
  $not: { $eq: TaskStatusEnum.Deleted },
};

class TaskService {
  async getTasks(
    parentId: string,
    status?: TaskStatusEnum,
  ): Promise<Array<Task>> {
    const objectId = new Types.ObjectId(parentId);
    return taskModel
      .find({
        parentId: objectId,
        status: status || statusQuerySelectorDefault,
      })
      .populate(taskPopulateOptions);
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await taskModel.findOne({
      _id: id,
      status: statusQuerySelectorDefault,
    });
    if (task) {
      return task.populate(taskPopulateOptions);
    }
    throw new GraphQLError(`Task ${id} not found`);
  }

  async createTask(
    task: CreateTaskInput,
    contextUser: User | undefined,
  ): Promise<Task> {
    const parentIdString = task.parentId.toString();
    const parent = await ProjectService.findActiveProject(parentIdString);
    if (!parent) {
      throw new GraphQLError(`Parent project ${parentIdString} not found`);
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

  async updateTask(
    task: UpdateTaskInput,
    user: User,
  ): Promise<LeanDocument<Task> | null> {
    const prevTask = await taskModel.findById(task.id).populate('assignees');

    if (!prevTask) {
      throw new GraphQLError(`Task ${task.id} not found`);
    }

    if (task.assignees) {
      prevTask.assignees = await userService.getUsersForAssignees(
        task.assignees,
      );

      await historyService.createEntry(
        HistoryEventEnum.AssigneesChanged,
        task.id,
        user,
      );
    }

    if (task.labels) {
      prevTask.labels = await labelService.getTaskLabels(task.labels);
      await historyService.createEntry(
        HistoryEventEnum.LabelsChanged,
        task.id,
        user,
      );
    }

    if (!isUndefined(task.title)) {
      prevTask.title = task.title;
    }

    if (!isUndefined(task.description)) {
      prevTask.description = task.description;
      await historyService.createEntry(
        HistoryEventEnum.DescriptionUpdated,
        task.id,
        user,
      );
    }

    const curTask = await prevTask.save();
    return curTask.populate(taskPopulateOptions);
  }

  async changeStatus(
    id: string,
    value: TaskStatusEnum,
    user: User,
  ): Promise<boolean> {
    const task = await taskModel.findById(id);
    if (!task) {
      throw new GraphQLError(`Task ${id} not found`);
    }

    if (task.status === value || task.status === TaskStatusEnum.Deleted) {
      throw new GraphQLError('Action not allowed');
    }

    switch (value) {
      case TaskStatusEnum.Deleted:
        return this.deleteTask(task);
      case TaskStatusEnum.Closed:
      case TaskStatusEnum.Open:
        task.status = value;
        await task.save();
        await historyService.createEntry(
          HistoryEventEnum.StatusChanged,
          id,
          user,
        );
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
    throw new GraphQLError(`Parent project ${parentIdString} not found`);
  }
}

export default new TaskService();
