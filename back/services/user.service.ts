import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { LeanDocument } from 'mongoose';

import {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '../models/interfaces/user.interface';
import { UserModel, userModel } from '../models/schemas/db.schema';

class UserService {
  async getUsers(): Promise<Array<LeanDocument<UserModel>>> {
    const users = await userModel.find({ trashed: false }, null, {
      sort: { firstName: 'asc' },
    });
    return users.map((user) => user.toJSON());
  }

  async getUser(id: string): Promise<LeanDocument<UserModel> | null> {
    const user = await userModel.findById(id);
    return user ? user.toJSON() : null;
  }

  async getUserByName(
    username: string,
  ): Promise<LeanDocument<UserModel> | null> {
    const getUser = async () => userModel.findOne({ username }).exec();
    const user = await getUser();

    return user ? user.toJSON() : null;
  }

  async createUser(user: CreateUserInput): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);

    return userModel.create(user);
  }

  async updateUser(
    user: UpdateUserInput,
  ): Promise<LeanDocument<UserModel> | null> {
    const document = await userModel.findById(user.id);

    if (document) {
      Object.entries(user).forEach(([key, value]) => {
        if (key !== 'id' && value) {
          document.set(key, value);
        }
      });
      const res = await document.save();

      return res.toJSON();
    }

    return null;
  }

  async deleteUser(
    id: string,
    currentUserId: string | undefined,
  ): Promise<boolean> {
    if (id === currentUserId) {
      throw new ApolloError('Can not delete current user');
    }

    const user = await userModel.findOne({ _id: id, trashed: false });
    if (user) {
      user.trashed = true;
      await user.save();
      return true;
    }

    return false;
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
