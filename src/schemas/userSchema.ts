import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    token: String!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): User
  }
`;
