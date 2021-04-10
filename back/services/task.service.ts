import { Task } from 'back/models/task.interface';
import { taskModel } from '../models/db.schema';

export default class TaskService {
  async getTasks(): Promise<Array<Task>> {
    return await taskModel.find({});
  }

  async getTask(id: string): Promise<Task | null> {
    return await taskModel.findById(id);
  }

  async createTask(task: Task): Promise<Task> {
    return await taskModel.create(task);
  }

  async updateTask(task: Task): Promise<Task | null> {
    return await taskModel.findByIdAndUpdate(
      task.id,
      { $set: { title: task.title } },
      { upsert: false, new: true },
    );
  }

  async deleteTask(id: string): Promise<Task | null> {
    return await taskModel.findByIdAndDelete(id);
  }
}
