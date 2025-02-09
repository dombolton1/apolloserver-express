import pool from '../database.js';
import { Collection, CollectionWithCourses } from '../types/collectionTypes.js';
import { Course } from '../types/courseTypes.js';
import { QueryResult } from 'pg';


export const resolvers = {
  Query: {
    getCollectionById: async (
      _: any,
      { id }: { id: string }
    ): Promise<CollectionWithCourses> => {
      try {
        const collectionResult: QueryResult<Collection> = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

        if (collectionResult.rows.length === 0) {
          throw new Error('Unable to find collection')
        }

        const collection: Collection | undefined = collectionResult.rows[0];

        const courseResult: QueryResult<Course> = await pool.query(
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
    getCollections: async (
      _: any
    ): Promise<Collection[]> => {
      try {
        const result: QueryResult<Collection> = await pool.query('SELECT * FROM collections');

        return result.rows;
      } catch (error) {
        console.error(error);
        throw new Error('Unable to find collections.')
      }
    }
  },
  Mutation: {
    addCollection: async(
      _: any,
      name: { name: string }
    ): Promise<Collection> => {
      try {
        const result: QueryResult<Collection> = await pool.query('INSERT INTO collections (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Unable to create collection')
      }
    }
  }
}
