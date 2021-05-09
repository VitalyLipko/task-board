import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type Task {
    id: ID!
    title: String!
    created: Date!
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
    tasks: [Task!]!
    task(id: ID!): Task
    user(username: String): User
  }

  type Mutation {
    createTask(task: CreateTaskInput!): Task!
    updateTask(task: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean
    login(username: String!, password: String!): String
    logout(username: String): Boolean
  }

  input CreateTaskInput {
    title: String!
  }

  input UpdateTaskInput {
    id: ID!
    title: String
  }
`;
