import { User } from '../models/user.interface';
import { userModel } from '../models/db.schema';

export default class UserService {
  async getUser(username: string) {
    const user = await userModel.findOne({ username }).lean();

    if (user) {
      user.id = user._id;
    }

    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await userModel.create(user);
  }
}
