import { User } from '../models/user.interface';
import { userModel } from '../models/db.schema';

export default class UserService {
  async getUser(username: string) {
    return await userModel.findOne({ username }).lean();
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await userModel.create(user);
  }
}
