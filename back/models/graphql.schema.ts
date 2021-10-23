import { gql } from 'apollo-server-express';

export default gql`
  scalar DateTime
  scalar HexColorCode

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
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    created: DateTime!
    parentId: String!
    assignees: [User!]!
    creator: User!
    isOpen: Boolean!
    labels: [Label!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    trashed: Boolean!
  }

  type Query {
    isLoggedIn: Boolean
    label: Label
    labels: [Label!]!
    project(id: ID!): Project
    projects: [Project!]!
    task(id: ID!): Task
    tasks(parentId: ID!): [Task!]!
    user(id: ID): User
    users: [User!]!
  }

  type Mutation {
    createProject(project: CreateProjectInput!): Project!
    updateProject(project: UpdateProjectInput!): Project
    createTask(task: CreateTaskInput!): Task!
    updateTask(task: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean
    login(username: String!, password: String!): String
    logout(id: ID): Boolean
    createUser(user: CreateUserInput): User!
    updateUser(user: UpdateUserInput): User!
    deleteUser(id: ID!): Boolean
    createLabel(label: CreateLabelInput!): Label!
    updateLabel(label: UpdateLabelInput!): Label
    deleteLabel(id: ID!): Boolean
  }

  input CreateProjectInput {
    name: String!
  }

  input UpdateProjectInput {
    id: ID!
    name: String
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
