import { IResolvers } from 'graphql-tools';

import AuthService from '../services/auth.service';
import TaskService from '../services/task.service';

const taskService = new TaskService();
const authService = new AuthService();

export const resolvers: IResolvers = {
  Query: {
    tasks: (_, __, context) =>
      authService.operationGuard(
        context,
        taskService.getTasks().then((res) => res),
      ),
    task: (_, args, context) =>
      authService.operationGuard(
        context,
        taskService.getTask(args.id).then((res) => res),
      ),
  },
  Mutation: {
    createTask: (_, args, context) =>
      authService.operationGuard(
        context,
        taskService.createTask(args.task).then((res) => res),
      ),
    updateTask: (_, args, context) =>
      authService.operationGuard(
        context,
        taskService.updateTask(args.task).then((res) => res),
      ),
    deleteTask: (_, args, context) =>
      authService.operationGuard(
        context,
        taskService.deleteTask(args.id).then((res) => !!res),
      ),
    login: (_, args) =>
      authService.login(args.username, args.password).then((res) => res),
  },
};
