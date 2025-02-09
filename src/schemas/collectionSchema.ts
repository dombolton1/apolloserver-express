import { gql } from 'graphql-tag';
import pool from '../database.js';

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

export const resolvers = {
  Query: {
    getCollectionById: async (_: any, { id }: { id: string }) => {
      try {
        const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [id])

        if (collectionResult.rows.length === 0) {
          throw new Error('Unable to find collection')
        }

        const collection = collectionResult.rows[0];
        const courseResult = await pool.query(
          'SELECT courses.* FROM courses JOIN course_collections ON courses.id = course_collections.course_id WHERE course_collections.collections_id = $1',
          [id]
        );
        return {
          id: collection.id,
          name: collection.name,
          courses: courseResult.rows,
        };
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
