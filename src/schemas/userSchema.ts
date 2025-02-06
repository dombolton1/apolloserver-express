// userSchema.ts
import { gql } from 'graphql-tag';  // Updated import
import pool from '../database.js';

// Define the User type and operations (queries and mutations)
export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

export const resolvers = {
  Query: {
    // Example of a query to get a user by ID
    getUser: async (_: any, { id }: { id: string }) => {
      // This is just a mock, in a real app, you would query your database.
      return {
        id,
        name: "John Doe",
        email: "john.doe@example.com",
      };
    },
  },
  // Mutation: {
  //   // Example of a mutation to create a user
  //   createUser: async (_: any, { name, email }: { name: string, email: string }) => {
  //     // Normally, you would insert the new user into your database and return the created user.
  //     return {
  //       id: "1",  // Here we mock the ID
  //       name,
  //       email,
  //     };
  //   },
  // },
  Mutation: {
    createUser: async (_, { name, email }) => {
      // SQL query to insert a new user into the 'users' table
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
        [name, email]
      );

      // Return the user data that was inserted
      return result.rows[0];
    },
  },
};
