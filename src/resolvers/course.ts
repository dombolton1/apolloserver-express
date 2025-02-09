import pool from '../database.js';
import { Course, AddCourseArgs, UpdateCourseArgs } from '../types/courseTypes.js'
import { QueryResult } from 'pg';

export const resolvers = {
  Query: {
    getCourseById: async (
      _: any,
      { id }: { id: string }
    ): Promise<Course | null> => {
      try {
        const result: QueryResult<Course> = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
          throw new Error('Course not found');
        }

        return result.rows[0];
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching course by ID');
      }
    },
    getAllCourses: async (
        _: any,
        { limit = 50, sortingOrder = "ASC" }: { limit?: number, sortingOrder?: "ASC" | "DESC" })
    : Promise<Course[]> => {
      try {

        if (sortingOrder !== "ASC" && sortingOrder !== "DESC") {
          throw new Error("Invalid sorting order. ASC or DESC")
        }
        const result: QueryResult<Course> = await pool.query(
          `SELECT * FROM courses ORDER BY id ${sortingOrder} LIMIT $1`,
          [limit]
        );
        return result.rows;

      } catch (error) {
        console.error(error);
        throw new Error('Error fetching courses');
      }
    }
  },
  Mutation: {
    addCourse: async (
      _: any,
      { title, description, duration, outcome }: AddCourseArgs,
      context: any
    ): Promise<Course> => {
      try {
        if (!context.user) {
          throw new Error('Authentication required')
        }

        const result: QueryResult<Course> = await pool.query(
          'INSERT INTO courses (title, description, duration, outcome) VALUES ($1, $2, $3, $4) RETURNING *',
          [title, description, duration, outcome]
        );

        return result.rows[0];
      } catch (error) {
        console.error(error);
        if (error.message === 'Authentication required') {
          throw new Error('Authentication required');
        }
        throw new Error('Error creating course');
      }
    },
    deleteCourse: async (
      _: any,
      { id }: { id: string },
      context: any
    ): Promise<Course> => {
      try{
        if (!context.user) {
          throw new Error('Authentication required')
        }

        const result: QueryResult<Course> = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
          throw new Error('Course not found');
        }

        const deletedCourse = result.rows[0];

        const deleteResult: QueryResult<Course> = await pool.query('DELETE FROM courses WHERE id = $1', [id]);

        if (deleteResult.rowCount === 0) {
          throw new Error('Failed to delete course');
        }

        return deletedCourse;
      } catch (error) {
        console.error(error);
        if (error.message === 'Authentication required') {
          throw new Error('Authentication required');
        }
        throw new Error('Error deleting course');
      }
    },
    updateCourse: async (
      _: any,
      { id, title, description, duration, outcome }: UpdateCourseArgs,
      context: any
    ): Promise<Course> => {
      try {
        if (!context.user) {
          throw new Error('Authentication required')
        }

        const result: QueryResult<Course> = await pool.query(
          'SELECT * FROM courses WHERE id = $1',
          [id]
        );

        if (result.rows.length === 0) {
          throw new Error('Course not found')
        }

        const foundCourse = result.rows[0];

        const updatedTitle = title || foundCourse.title;
        const updatedDescription = description || foundCourse.description;
        const updatedDuration = duration || foundCourse.duration;
        const updatedOutcome = outcome || foundCourse.outcome;

        const updatedResult: QueryResult<Course> = await pool.query(
          'UPDATE courses SET title = $1, description = $2, duration = $3, outcome = $4 WHERE id = $5 RETURNING *',
          [updatedTitle, updatedDescription, updatedDuration, updatedOutcome, id]
        );

        return updatedResult.rows[0];
      } catch (error) {
        console.error(error);
        if (error.message === 'Authentication required') {
          throw new Error('Authentication required');
        }
        throw new Error('Error updating course')
      }
    }
  }
}