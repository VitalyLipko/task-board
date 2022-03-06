import { IResolvers } from '@graphql-tools/utils';
import { DateTimeResolver, HexColorCodeResolver } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';

import authService from '../services/auth.service';
import boardService from '../services/board.service';
import labelService from '../services/label.service';
import projectService from '../services/project.service';
import taskService from '../services/task.service';
import userService from '../services/user.service';

import { ContextPayload } from './interfaces/context-payload.interface';

export const resolvers: IResolvers<unknown, ContextPayload> = {
  DateTime: DateTimeResolver,
  HexColorCode: HexColorCodeResolver,
  Upload: GraphQLUpload,

  Query: {
    board: (_, args, context) =>
      authService.operationGuard(context, () =>
        boardService.getBoard(args.parentId),
      ),
    isLoggedIn: (_, __, { user, token }) =>
      authService.isLoggedIn({ user, token }),
    labels: (_, args, context) =>
      authService.operationGuard(context, () => labelService.getLabels()),
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
        userService.getUser(args.id || context.user?.id),
      ),
    users: (_, args, context) =>
      authService.operationGuard(context, () => userService.getUsers()),
  },
  Mutation: {
    createLabel: (_, args, context) =>
      authService.operationGuard(context, () =>
        labelService.createLabel(args.label),
      ),
    createProject: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.createProject(args.project),
      ),
    updateProject: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.updateProject(args.project),
      ),
    deleteProject: (_, args, context) =>
      authService.operationGuard(context, () =>
        projectService.deleteProject(args.id),
      ),
    createTask: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.createTask(args.task, context.user),
      ),
    updateTask: (_, args, context) =>
      authService.operationGuard(context, () =>
        taskService.updateTask(args.task),
      ),
    changeTaskStatus: (_, { id, value }, context) =>
      authService.operationGuard(context, () =>
        taskService.changeStatus(id, value),
      ),
    login: (_, args, context) =>
      authService.login(args.username, args.password, context.res),
    logout: (_, args, context) =>
      authService.operationGuard(context, () =>
        authService.logout(
          args.id || context.user?.id,
          context.token,
          context.res,
        ),
      ),
    createUser: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.createUser(args.user),
      ),
    updateUser: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.updateUser(args.user),
      ),
    deleteUser: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.deleteUser(args.id, context.user?.id),
      ),
  },
};
