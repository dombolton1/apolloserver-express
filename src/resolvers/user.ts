import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserWithToken, UserArgs } from '../types/userTypes.js';
import { QueryResult } from 'pg';

const JWT_SECRET = 'securepassword';


export const resolvers = {
  Mutation: {
    register: async (
      _: any,
      { username, password }: UserArgs
    ): Promise<User> => {
      try {
        const checkUserExists: QueryResult<User> = await pool.query(
          'SELECT * FROM users WHERE username = $1',
          [username]
        );

        if (checkUserExists.rows.length > 0) {
          throw new Error('User already exists')
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const result: QueryResult<User> = await pool.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
          [username, hashedPwd]
        );

        return { id: result.rows[0].id, username: result.rows[0].username };
      } catch (error) {
        console.error(error);
        throw new Error('Error registering user')
      }
    },

    login: async (
      _: any,
      { username, password }: UserArgs
    ): Promise<UserWithToken> => {
      try {
        const userResult: QueryResult<User> = await pool.query(
          'SELECT * FROM users WHERE username = $1',
          [username]
        )
        const user = userResult.rows[0];

        if (!user) {
          throw new Error('Invalid username or password')
        }

        const checkValid = await bcrypt.compare(password, user.password);
        if (!checkValid) {
          throw new Error('Invalid username or password')
        }

        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '1h' }
        )

        return {
          id: user.id,
          username: user.username,
          token: token
        };
      } catch (error) {
        console.error(error);
        throw new Error('Error logging in');
      }
    }
  }
}