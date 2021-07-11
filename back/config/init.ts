import { CreateUserInput } from '../models/user.interface';
import UserService from '../services/user.service';

const admin: CreateUserInput = {
  username: 'admin',
  password: 'admin',
  email: 'admin@example.ru',
  firstName: 'Admin',
  lastName: 'Admin',
};
const userService = new UserService();

export default async (): Promise<void> => {
  return userService
    .getUser(admin.username)
    .then((res) =>
      res
        ? new Promise<void>((resolve) => resolve())
        : userService.createUser(admin).then(),
    );
};
