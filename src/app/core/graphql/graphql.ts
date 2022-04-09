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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Board = {
  __typename?: 'Board';
  parentId: Scalars['String'];
  columns: Array<Column>;
};

export type Column = {
  __typename?: 'Column';
  label: Label;
  items: Array<Task>;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  parentId: Scalars['String'];
  created: Scalars['DateTime'];
  creator: User;
  message: Scalars['String'];
};

export type CreateCommentInput = {
  parentId: Scalars['String'];
  message: Scalars['String'];
};

export type CreateLabelInput = {
  title: Scalars['String'];
  backgroundColor?: Maybe<Scalars['HexColorCode']>;
  isSystem?: Maybe<Scalars['Boolean']>;
};

export type CreateProjectInput = {
  name: Scalars['String'];
  icon?: Maybe<Scalars['Upload']>;
};

export type CreateTaskInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  parentId: Scalars['String'];
  assignees?: Maybe<Array<Scalars['String']>>;
  labels?: Maybe<Array<Scalars['String']>>;
};

export type CreateUserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  name: Scalars['String'];
  url: Scalars['String'];
  mimeType: Scalars['String'];
  size: Scalars['Int'];
  encoding: Scalars['String'];
};

export type Label = {
  __typename?: 'Label';
  id: Scalars['ID'];
  title: Scalars['String'];
  backgroundColor?: Maybe<Scalars['HexColorCode']>;
  isSystem: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  updateProject?: Maybe<Project>;
  deleteProject?: Maybe<Scalars['Boolean']>;
  createTask: Task;
  updateTask?: Maybe<Task>;
  changeTaskStatus?: Maybe<Scalars['Boolean']>;
  login?: Maybe<Scalars['String']>;
  logout?: Maybe<Scalars['Boolean']>;
  createUser: User;
  updateUser: User;
  deleteUser?: Maybe<Scalars['Boolean']>;
  createLabel: Label;
  updateLabel?: Maybe<Label>;
  deleteLabel?: Maybe<Scalars['Boolean']>;
  createComment: Comment;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTaskArgs = {
  task: CreateTaskInput;
};


export type MutationUpdateTaskArgs = {
  task: UpdateTaskInput;
};


export type MutationChangeTaskStatusArgs = {
  id: Scalars['ID'];
  value: TaskStatusEnum;
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


export type MutationCreateLabelArgs = {
  label: CreateLabelInput;
};


export type MutationUpdateLabelArgs = {
  label: UpdateLabelInput;
};


export type MutationDeleteLabelArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCommentArgs = {
  comment: CreateCommentInput;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  created: Scalars['DateTime'];
  tasks: Array<Task>;
  status: ProjectStatusEnum;
  icon?: Maybe<File>;
};


export type ProjectTasksArgs = {
  status?: Maybe<TaskStatusEnum>;
};

export enum ProjectStatusEnum {
  Active = 'ACTIVE',
  Deleted = 'DELETED'
}

export type Query = {
  __typename?: 'Query';
  board?: Maybe<Board>;
  isLoggedIn?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Label>;
  labels: Array<Label>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  user?: Maybe<User>;
  users: Array<User>;
  comments: Array<Comment>;
};


export type QueryBoardArgs = {
  parentId: Scalars['ID'];
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


export type QueryCommentsArgs = {
  parentId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  commentCreated: Comment;
};


export type SubscriptionCommentCreatedArgs = {
  parentId: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  parentId: Scalars['String'];
  assignees: Array<User>;
  creator: User;
  labels: Array<Label>;
  status: TaskStatusEnum;
};

export enum TaskStatusEnum {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Deleted = 'DELETED'
}

export type UpdateLabelInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  backgroundColor?: Maybe<Scalars['HexColorCode']>;
};

export type UpdateProjectInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['Upload']>;
};

export type UpdateTaskInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  assignees?: Maybe<Array<Scalars['String']>>;
  labels?: Maybe<Array<Scalars['String']>>;
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
