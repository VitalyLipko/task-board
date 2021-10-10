import { gql } from 'apollo-server-express';

export default gql`
  scalar Date

  type Project {
    id: ID!
    name: String!
    created: Date!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    created: Date!
    parentId: String!
    assignees: [User!]!
    creator: User!
    isOpen: Boolean!
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
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    assignees: [String!]
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
`;
