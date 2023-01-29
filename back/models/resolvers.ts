import { IResolvers } from '@graphql-tools/utils';
import { DateTimeResolver, HexColorCodeResolver } from 'graphql-scalars';
import { withFilter } from 'graphql-subscriptions';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import authService from '../services/auth.service';
import boardService from '../services/board.service';
import commentService from '../services/comment.service';
import historyService from '../services/history.service';
import labelService from '../services/label.service';
import passwordService from '../services/password.service';
import projectService from '../services/project.service';
import subscriptionsService from '../services/subscriptions.service';
import taskService from '../services/task.service';
import userService from '../services/user.service';

import { TaskStatusEnum } from './enums/task-status.enum';
import { ContextPayload } from './interfaces/context-payload.interface';
import { User } from './interfaces/user.interface';

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
    project: (_, args, context, { variableValues }) =>
      authService.operationGuard(context, () =>
        projectService.getProject(
          args.id,
          variableValues.tasksStatus as TaskStatusEnum,
        ),
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
    comments: (_, args, context) =>
      authService.operationGuard(context, () =>
        commentService.getComments(args.parentId),
      ),
    historyEntries: (_, args, context) =>
      authService.operationGuard(context, () =>
        historyService.getEntries(args.parentId),
      ),
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
        taskService.updateTask(args.task, context.user as User),
      ),
    changeTaskStatus: (_, { id, value }, context) =>
      authService.operationGuard(context, () =>
        taskService.changeStatus(id, value, context.user as User),
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
    updateProfile: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.updateProfile(args.user),
      ),
    deleteUser: (_, args, context) =>
      authService.operationGuard(context, () =>
        userService.deleteUser(args.id, context.user?.id),
      ),
    createComment: (_, args, context) =>
      authService.operationGuard(context, () =>
        commentService.createComment(args.comment, context.user),
      ),
    changePassword: (_, args, context) =>
      authService.operationGuard(context, () =>
        passwordService.changePassword(
          args.currentPassword,
          args.newPassword,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          context.user.id,
        ),
      ),
  },
  Subscription: {
    commentCreated: {
      subscribe: withFilter(
        () => subscriptionsService.commentCreatedListener(),
        ({ commentCreated }, { parentId }) =>
          commentCreated.parentId.toString() === parentId,
      ),
    },
    historyEntryAdded: {
      subscribe: withFilter(
        () => subscriptionsService.historyEntryAddedListener(),
        ({ historyEntryAdded }, { parentId }) =>
          historyEntryAdded.parentId.toString() === parentId,
      ),
    },
  },
};
