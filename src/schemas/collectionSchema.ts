import { gql } from 'graphql-tag';
import pool from '../database.js';

export const typeDefs = gql`
  type Collection {
    id: ID!
    name: String!
  }

  type Query {
    getCollectionById(id: ID!): Collection
    getCollections: [Collection]
  }

  type Mutation {
    addCollection(name: String!): Collection!
  }
`;

export const resolvers = {
  Query: {
    getCollectionById: async (_: any, { id }: { id: string }) => {
      try {
        const result = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

        if (result.rows.length === 0) {
          throw new Error('Collection not found');
        }

        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Unable to find collection by ID')
      }
    },
    getCollections: async (_: any) => {
      try {
        const result = await pool.query('SELECT * FROM collections');

        return result.rows;
      } catch (error) {
        console.error(error);
        throw new Error('Unable to find collections.')
      }
    }
  },
  Mutation: {
    addCollection: async(_: any, name: { name: string }) => {
      try {
        const result = await pool.query('INSERT INTO collections (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Unable to create collection')
      }
    }
  }
}
