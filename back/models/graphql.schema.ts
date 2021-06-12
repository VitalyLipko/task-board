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
    created: Date!
    parentId: String!
    assignees: [User!]!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    project(id: ID!): Project
    projects: [Project!]!
    task(id: ID!): Task
    tasks(parentId: ID!): [Task!]!
    user(username: String): User
  }

  type Mutation {
    createProject(project: CreateProjectInput!): Project!
    updateProject(project: UpdateProjectInput!): Project
    createTask(task: CreateTaskInput!): Task!
    updateTask(task: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean
    login(username: String!, password: String!): String
    logout(username: String): Boolean
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
    parentId: String!
    assignees: [String!]
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    assignees: [String!]
  }
`;
