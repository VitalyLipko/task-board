import { ApolloError } from 'apollo-server-express';
import isUndefined from 'lodash/isUndefined';
import { LeanDocument } from 'mongoose';

import {
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserInput,
  User,
} from '../models/interfaces/user.interface';
import { UserModel, userModel } from '../models/schemas/db.schema';

import fileStorageService from './file-storage.service';
import passwordService from './password.service';

class UserService {
  async getUsers(): Promise<Array<LeanDocument<UserModel>>> {
    const users = await userModel.find({ trashed: false }, null, {
      sort: { firstName: 'asc' },
    });
    return users.map((user) => user.toJSON());
  }

  async getUser(id: string): Promise<LeanDocument<UserModel> | null> {
    const user = await this.findActiveUser(id);
    if (!user) {
      throw new ApolloError(`User ${id} not found`);
    }
    return user.toJSON();
  }

  async findActiveUser(id: string) {
    return userModel.findOne({ _id: id, trashed: false });
  }

  async getUserByName(
    username: string,
    onlyActive = true,
  ): Promise<LeanDocument<UserModel> | null> {
    const getUser = async () =>
      userModel
        .findOne({ username, ...(onlyActive && { trashed: false }) })
        .exec();
    const user = await getUser();

    return user ? user.toJSON() : null;
  }

  async createUser(user: CreateUserInput): Promise<User> {
    const { firstName, lastName, email, ...rest } = user;
    rest.password = await passwordService.encrypt(rest.password);
    return userModel.create({
      ...rest,
      profile: { firstName, lastName, email },
    });
  }

  async updateUser(
    user: UpdateUserInput,
  ): Promise<LeanDocument<UserModel> | null> {
    const document = await this.findActiveUser(user.id);

    if (!document) {
      throw new ApolloError(`User ${user.id} not found`);
    }

    const { profile } = document;
    Object.entries(user).forEach(([key, value]) => {
      const k = key as keyof UpdateUserInput;
      if (k !== 'id' && value) {
        profile[k] = value;
      }
    });
    const res = await document.save();

    return res.toJSON();
  }

  async updateProfile(user: UpdateProfileInput): Promise<User> {
    const document = await this.findActiveUser(user.id);

    if (!document) {
      throw new ApolloError(`User ${user.id} not found`);
    }

    if (!isUndefined(user.avatar)) {
      if (user.avatar === null && document.profile.avatar) {
        await fileStorageService.delete(document.profile.avatar.url);
        document.profile.avatar = user.avatar;
      } else if (user.avatar && document.profile.avatar) {
        await fileStorageService.delete(document.profile.avatar.url);
        document.profile.avatar = await fileStorageService.save(user.avatar);
      } else {
        document.profile.avatar = await fileStorageService.save(user.avatar);
      }
    }
    const { profile } = document;
    Object.entries(user).forEach(([key, value]) => {
      if (!['id', 'avatar'].includes(key) && value) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        profile[key] = value;
      }
    });

    return document.save();
  }

  async deleteUser(
    id: string,
    currentUserId: string | undefined,
  ): Promise<boolean> {
    if (id === currentUserId) {
      throw new ApolloError('Can not delete current user');
    }

    const user = await this.findActiveUser(id);
    if (!user) {
      throw new ApolloError(`User ${id} not found`);
    }

    user.trashed = true;
    await user.save();
    return true;
  }

  async getUsersForAssignees(
    assigneeIds: Array<string>,
  ): Promise<Array<LeanDocument<User>>> {
    return Promise.all(assigneeIds.map((id) => this.getUser(id))).then(
      (users) => users.filter((user) => !!user) as Array<LeanDocument<User>>,
    );
  }
}

export default new UserService();
