import TaskService from '../services/task.service';
import { IResolvers } from 'graphql-tools';

const taskService = new TaskService();
export const resolvers: IResolvers = {
  Query: {
    tasks: () => taskService.getTasks().then((res) => res),
    task: (_, arg) => taskService.getTask(arg.id).then((res) => res),
  },
  Mutation: {
    createTask: (_, args) =>
      taskService.createTask(args.task).then((res) => res),
    updateTask: (_, args) =>
      taskService.updateTask(args.task).then((res) => res),
    deleteTask: (_, args) =>
      taskService.deleteTask(args.id).then((res) => !!res),
  },
};
