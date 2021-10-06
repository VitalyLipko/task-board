export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type CreateProjectInput = {
  name: Scalars['String'];
};

export type CreateTaskInput = {
  title: Scalars['String'];
  parentId: Scalars['String'];
  assignees?: Maybe<Array<Scalars['String']>>;
};

export type CreateUserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  updateProject?: Maybe<Project>;
  createTask: Task;
  updateTask?: Maybe<Task>;
  deleteTask?: Maybe<Scalars['Boolean']>;
  login?: Maybe<Scalars['String']>;
  logout?: Maybe<Scalars['Boolean']>;
  createUser: User;
  updateUser: User;
  deleteUser?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
};


export type MutationCreateTaskArgs = {
  task: CreateTaskInput;
};


export type MutationUpdateTaskArgs = {
  task: UpdateTaskInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLogoutArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationCreateUserArgs = {
  user?: Maybe<CreateUserInput>;
};


export type MutationUpdateUserArgs = {
  user?: Maybe<UpdateUserInput>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  created: Scalars['Date'];
  tasks: Array<Task>;
};

export type Query = {
  __typename?: 'Query';
  isLoggedIn?: Maybe<Scalars['Boolean']>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryTaskArgs = {
  id: Scalars['ID'];
};


export type QueryTasksArgs = {
  parentId: Scalars['ID'];
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  title: Scalars['String'];
  created: Scalars['Date'];
  parentId: Scalars['String'];
  assignees: Array<User>;
  creator: User;
  isOpen: Scalars['Boolean'];
};

export type UpdateProjectInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateTaskInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  assignees?: Maybe<Array<Scalars['String']>>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  fullName: Scalars['String'];
  trashed: Scalars['Boolean'];
};
