import { mkdir } from 'fs';
import { access } from 'fs/promises';

import { CreateLabelInput } from '../models/interfaces/label.interface';
import { CreateUserInput } from '../models/interfaces/user.interface';
import labelService from '../services/label.service';
import userService from '../services/user.service';

import config from './index';

const admin: CreateUserInput = {
  username: 'admin',
  password: 'admin',
  email: 'admin@example.ru',
  firstName: 'Admin',
  lastName: 'Admin',
};
const systemLabels: Array<CreateLabelInput> = [
  {
    title: 'priority::high',
    backgroundColor: '#f01b0c',
    isSystem: true,
  },
  {
    title: 'priority::medium',
    backgroundColor: '#f0bb0c',
    isSystem: true,
  },
  {
    title: 'priority::low',
    backgroundColor: '#0eed59',
    isSystem: true,
  },
];

export default async (): Promise<void> => {
  const adminUser = await userService.getUserByName(admin.username, false);
  if (!adminUser) {
    await userService.createUser(admin);
  }

  const labels = await labelService.getLabels();
  if (!labels.length) {
    await Promise.all(
      systemLabels.map((label) => labelService.createLabel(label)),
    );
  }

  await access(config.appDataPath).catch(() =>
    mkdir(config.appDataPath, (err) => {
      if (err) {
        console.log(err.message);
      }
    }),
  );
};
