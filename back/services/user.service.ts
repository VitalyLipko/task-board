import bcrypt from 'bcrypt';
import { LeanDocument } from 'mongoose';

import { UserModel, userModel } from '../models/db.schema';
import { CreateUserInput, User } from '../models/user.interface';

export default class UserService {
  async getUser(username: string): Promise<LeanDocument<UserModel> | null> {
    return userModel.findOne({ username }).lean();
  }

  async createUser(user: CreateUserInput): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);

    return userModel.create(user);
  }
}
