import bcrypt from 'bcrypt';

import { CreateUserInput, User } from '../models/user.interface';
import { userModel } from '../models/db.schema';

export default class UserService {
  async getUser(username: string) {
    const user = await userModel.findOne({ username }).lean();

    return user;
  }

  async createUser(user: CreateUserInput): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);

    return userModel.create(user);
  }
}
