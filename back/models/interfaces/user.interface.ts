export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  trashed: boolean;
}

export interface CreateUserInput {
  username: User['username'];
  password: User['password'];
  email: User['email'];
  firstName: User['firstName'];
  lastName: User['lastName'];
}

export interface UpdateUserInput {
  id: User['id'];
  email?: User['email'];
  firstName?: User['firstName'];
  lastName?: User['lastName'];
}
