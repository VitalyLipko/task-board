import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql/error';

import userService from './user.service';

const SALT_ROUNDS = 10;
class PasswordService {
  async encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(passwordI: string, passwordJ: string): Promise<boolean> {
    return bcrypt.compare(passwordI, passwordJ);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    userId: string,
  ): Promise<boolean> {
    const user = await userService.findActiveUser(userId);
    if (!user) {
      throw new GraphQLError(`User ${userId} not found`);
    }

    const isCurrentPasswordCorrect = await this.compare(
      currentPassword,
      user.password,
    );
    if (isCurrentPasswordCorrect) {
      user.password = await this.encrypt(newPassword);
      await user.save();
      return true;
    }

    throw new GraphQLError('Current password is incorrect');
  }
}

export default new PasswordService();
