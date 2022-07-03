import { gql } from 'apollo-server-express';

export default gql`
  scalar DateTime
  scalar HexColorCode
  scalar Upload

  enum ProjectStatusEnum {
    ACTIVE
    DELETED
  }

  enum TaskStatusEnum {
    OPEN
    CLOSED
    DELETED
  }

  type Comment {
    id: ID!
    parentId: String!
    created: DateTime!
    creator: User!
    message: String!
  }

  type Board {
    parentId: String!
    columns: [Column!]!
  }

  type Column {
    label: Label!
    items: [Task!]!
  }

  type File {
    name: String!
    url: String!
    mimeType: String!
    size: Int!
    encoding: String!
  }

  type Label {
    id: ID!
    title: String!
    backgroundColor: HexColorCode
    isSystem: Boolean!
  }

  type Project {
    id: ID!
    name: String!
    created: DateTime!
    tasks(status: TaskStatusEnum): [Task!]!
    status: ProjectStatusEnum!
    icon: File
  }

  type Task {
    id: ID!
    title: String!
    description: String
    created: DateTime!
    parentId: String!
    assignees: [User!]!
    creator: User!
    labels: [Label!]!
    status: TaskStatusEnum!
    commentCount: Int!
  }

  type Profile {
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    avatar: File
  }

  type User {
    id: ID!
    username: String!
    trashed: Boolean!
    profile: Profile!
  }

  type Query {
    board(parentId: ID!): Board
    isLoggedIn: Boolean
    label: Label
    labels: [Label!]!
    project(id: ID!): Project
    projects: [Project!]!
    task(id: ID!): Task
    tasks(parentId: ID!): [Task!]!
    user(id: ID): User
    users: [User!]!
    comments(parentId: String!): [Comment!]!
  }

  type Mutation {
    createProject(project: CreateProjectInput!): Project!
    updateProject(project: UpdateProjectInput!): Project
    deleteProject(id: ID!): Boolean
    createTask(task: CreateTaskInput!): Task!
    updateTask(task: UpdateTaskInput!): Task
    changeTaskStatus(id: ID!, value: TaskStatusEnum!): Boolean
    login(username: String!, password: String!): String
    logout(id: ID): Boolean
    createUser(user: CreateUserInput): User!
    updateUser(user: UpdateUserInput): User!
    updateProfile(user: UpdateProfileInput!): User!
    deleteUser(id: ID!): Boolean
    createLabel(label: CreateLabelInput!): Label!
    updateLabel(label: UpdateLabelInput!): Label
    deleteLabel(id: ID!): Boolean
    createComment(comment: CreateCommentInput!): Comment!
    changePassword(currentPassword: String!, newPassword: String!): Boolean
  }

  type Subscription {
    commentCreated(parentId: String!): Comment!
  }

  input CreateCommentInput {
    parentId: String!
    message: String!
  }

  input CreateProjectInput {
    name: String!
    icon: Upload
  }

  input UpdateProjectInput {
    id: ID!
    name: String
    icon: Upload
  }

  input CreateTaskInput {
    title: String!
    description: String
    parentId: String!
    assignees: [String!]
    labels: [String!]
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    assignees: [String!]
    labels: [String!]
  }

  input CreateUserInput {
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  input UpdateUserInput {
    id: ID!
    email: String
    firstName: String
    lastName: String
  }

  input UpdateProfileInput {
    id: ID!
    email: String
    firstName: String
    lastName: String
    avatar: Upload
  }

  input CreateLabelInput {
    title: String!
    backgroundColor: HexColorCode
    isSystem: Boolean
  }

  input UpdateLabelInput {
    id: ID!
    title: String
    backgroundColor: HexColorCode
  }
`;
