import { gql } from 'graphql-tag';
import pool from '../database.js';

export const typeDefs = gql`
  type Course {
    id: ID!
    title: String!
    description: String
    duration: Float!
    outcome: [String]
  }

  type Query {
    getCourseById(id: ID!): Course
    getAllCourses(limit: Int, sortingOrder: String): [Course!]
  }


  type Mutation {
    addCourse(
      title: String!,
      description: String,
      duration: Float!,
      outcome: [String]
    ): Course!
  }
`;

export const resolvers = {
  Query: {
    getCourseById: async(_: any, { id }: { id: string }) => {
      try {
        const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
          throw new Error('Course not found');
        }

        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching course by ID');
      }
    },
    getAllCourses: async(_: any, { limit = 50, sortingOrder = "ASC" }: { limit?: number, sortingOrder?: "ASC" | "DESC" }) => {
      try {

        if (sortingOrder !== "ASC" && sortingOrder !== "DESC") {
          throw new Error("Invalid sorting order. ASC or DESC")
        }
        const result = await pool.query(`SELECT * FROM courses ORDER BY title ${sortingOrder} LIMIT $1`, [limit]);
        return result.rows;

      } catch (error) {
        console.error(error);
        throw new Error('Error fetching courses');
      }
    }
  },
  Mutation: {
    addCourse: async(_: any, { title, description, duration, outcome }: { title: string, description: string, duration: number, outcome: string[] }) => {
      try {
        const result = await pool.query(
          'INSERT INTO courses (title, description, duration, outcome) VALUES ($1, $2, $3, $4) RETURNING *',
          [title, description, duration, outcome]
        );

        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Error creating course');
      }
    }
  }
}