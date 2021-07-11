import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../models/task.interface';
import { taskModel, projectModel, userModel } from '../models/db.schema';
import { LeanDocument } from 'mongoose';

export default class TaskService {
  async getTasks(parentId: string): Promise<Array<Task>> {
    const tasks = await taskModel.find({ parentId }).populate('assignees');
    return tasks.map((task) => task.toJSON());
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await taskModel.findById(id).populate('assignees');
    return task?.toJSON() || null;
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    const document = new taskModel({
      title: task.title,
      parentId: task.parentId,
    });

    if (task.assignees?.length) {
      const users = await Promise.all(
        task.assignees.map((assignee) => userModel.findById(assignee).lean()),
      );
      users.forEach((user) => {
        if (user) {
          document.assignees.push(user);
        }
      });
    }

    await document.save();

    const parent = await projectModel.findById(task.parentId);
    parent?.tasks.push(document);
    await parent?.save();

    return document;
  }

  async updateTask(task: UpdateTaskInput): Promise<LeanDocument<Task> | null> {
    const prevTask = await taskModel.findById(task.id).populate('assignees');

    if (!prevTask) {
      return null;
    }

    if (task.assignees?.length) {
      const users = await Promise.all(
        task.assignees.map((assignee) => userModel.findById(assignee).lean()),
      );
      prevTask.assignees = [];
      users.forEach((user) => {
        if (user) {
          prevTask.assignees.push(user);
        }
      });
    } else if (task.assignees?.length === 0 && prevTask?.assignees.length) {
      prevTask.assignees = [];
    }

    if (task.title) {
      prevTask.title = task.title;
    }

    const curTask = await prevTask.save();
    await curTask.populate('assignees').execPopulate();

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
