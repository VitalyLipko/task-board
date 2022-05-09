import { FileUpload } from 'graphql-upload';

import { File } from './file.interface';

export interface User {
  id: string;
  username: string;
  password: string;
  trashed: boolean;
  profile: Profile;
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: File;
}

export interface CreateUserInput {
  username: User['username'];
  password: User['password'];
  email: Profile['email'];
  firstName: Profile['firstName'];
  lastName: Profile['lastName'];
}

export interface UpdateUserInput {
  id: User['id'];
  email?: Profile['email'];
  firstName?: Profile['firstName'];
  lastName?: Profile['lastName'];
}

export interface UpdateProfileInput extends UpdateUserInput {
  avatar?: FileUpload;
}
