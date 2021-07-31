import { IResolvers } from 'graphql-tools';

import AuthService from '../services/auth.service';
import ProjectService from '../services/project.service';
import TaskService from '../services/task.service';
import UserService from '../services/user.service';

import { ContextPayload } from './context-payload.interface';

const projectService = new ProjectService();
const taskService = new TaskService();
const authService = new AuthService();
const userService = new UserService();

export const resolvers: IResolvers<unknown, ContextPayload> = {
  Query: {
    isLoggedIn: (_, __, context) => authService.isLoggedIn(context),
    projects: (_, __, context) =>
      authService.operationGuard(context, () => projectService.getProjects()),
    project: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.getProject(args.id),
      ),
    tasks: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.getTasks(args.parentId),
      ),
    task: (_, args, context) =>
      authService.operationGuard(context, () => taskService.getTask(args.id)),
    user: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.getUser(args.username || context.user?.username),
      ),
  },
  Mutation: {
    createProject: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.createProject(args.project),
      ),
    updateProject: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.updateProject(args.project),
      ),
    createTask: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.createTask(args.task),
      ),
    updateTask: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.updateTask(args.task),
      ),
    deleteTask: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.deleteTask(args.id),
      ),
    login: (_, args, context) =>
      authService.login(args.username, args.password, context.res),
    logout: (_, args, context) =>
      authService.operationGuard(context, () =>
        authService.logout(
          args.username || context.user?.username,
          context.token,
        ),
      ),
  },
};
