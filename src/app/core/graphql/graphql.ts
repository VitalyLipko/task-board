export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  columns: Array<Column>;
  parentId: Scalars['String'];
};

export type Column = {
  __typename?: 'Column';
  items: Array<Task>;
  label: Label;
};

export type Comment = {
  __typename?: 'Comment';
  created: Scalars['DateTime'];
  creator: User;
  id: Scalars['ID'];
  message: Scalars['String'];
  parentId: Scalars['String'];
};

export type CreateCommentInput = {
  message: Scalars['String'];
  parentId: Scalars['String'];
};

export type CreateLabelInput = {
  backgroundColor?: InputMaybe<Scalars['HexColorCode']>;
  isSystem?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
};

export type CreateProjectInput = {
  icon?: InputMaybe<Scalars['Upload']>;
  name: Scalars['String'];
};

export type CreateTaskInput = {
  assignees?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
  parentId: Scalars['String'];
  title: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String'];
  mimeType: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type Label = {
  __typename?: 'Label';
  backgroundColor?: Maybe<Scalars['HexColorCode']>;
  id: Scalars['ID'];
  isSystem: Scalars['Boolean'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<Scalars['Boolean']>;
  changeTaskStatus?: Maybe<Scalars['Boolean']>;
  createComment: Comment;
  createLabel: Label;
  createProject: Project;
  createTask: Task;
  createUser: User;
  deleteLabel?: Maybe<Scalars['Boolean']>;
  deleteProject?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  login?: Maybe<Scalars['String']>;
  logout?: Maybe<Scalars['Boolean']>;
  updateLabel?: Maybe<Label>;
  updateProfile: User;
  updateProject?: Maybe<Project>;
  updateTask?: Maybe<Task>;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationChangeTaskStatusArgs = {
  id: Scalars['ID'];
  value: TaskStatusEnum;
};


export type MutationCreateCommentArgs = {
  comment: CreateCommentInput;
};


export type MutationCreateLabelArgs = {
  label: CreateLabelInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateTaskArgs = {
  task: CreateTaskInput;
};


export type MutationCreateUserArgs = {
  user?: InputMaybe<CreateUserInput>;
};


export type MutationDeleteLabelArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLogoutArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateLabelArgs = {
  label: UpdateLabelInput;
};


export type MutationUpdateProfileArgs = {
  user: UpdateProfileInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
};


export type MutationUpdateTaskArgs = {
  task: UpdateTaskInput;
};


export type MutationUpdateUserArgs = {
  user?: InputMaybe<UpdateUserInput>;
};

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<File>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  lastName: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  created: Scalars['DateTime'];
  icon?: Maybe<File>;
  id: Scalars['ID'];
  name: Scalars['String'];
  status: ProjectStatusEnum;
  tasks: Array<Task>;
};


export type ProjectTasksArgs = {
  status?: InputMaybe<TaskStatusEnum>;
};

export enum ProjectStatusEnum {
  Active = 'ACTIVE',
  Deleted = 'DELETED'
}

export type Query = {
  __typename?: 'Query';
  board?: Maybe<Board>;
  comments: Array<Comment>;
  isLoggedIn?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Label>;
  labels: Array<Label>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryBoardArgs = {
  parentId: Scalars['ID'];
};


export type QueryCommentsArgs = {
  parentId: Scalars['String'];
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
  id?: InputMaybe<Scalars['ID']>;
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
  assignees: Array<User>;
  created: Scalars['DateTime'];
  creator: User;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  labels: Array<Label>;
  parentId: Scalars['String'];
  status: TaskStatusEnum;
  title: Scalars['String'];
};

export enum TaskStatusEnum {
  Closed = 'CLOSED',
  Deleted = 'DELETED',
  Open = 'OPEN'
}

export type UpdateLabelInput = {
  backgroundColor?: InputMaybe<Scalars['HexColorCode']>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  icon?: InputMaybe<Scalars['Upload']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTaskInput = {
  assignees?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  labels?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  profile: Profile;
  trashed: Scalars['Boolean'];
  username: Scalars['String'];
};
