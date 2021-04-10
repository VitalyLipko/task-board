import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type Task {
    id: ID!
    title: String!
    created: Date!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(task: CreateTaskInput!): Task!
    updateTask(task: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean
  }

  input CreateTaskInput {
    title: String!
  }

  input UpdateTaskInput {
    id: ID!
    title: String
  }
`;
