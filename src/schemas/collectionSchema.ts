import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Collection {
    id: ID!
    name: String!
    courses: [Course!]!
  }

  type Course {
    id: ID!
    title: String!
    description: String
    duration: Float!
    outcome: [String]
  }

  type Query {
    getCollectionById(id: ID!): Collection
    getCollections: [Collection]
  }

  type Mutation {
    addCollection(name: String!): Collection!
  }
`;

