import { gql } from 'graphql-tag';
import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'securepassword';

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

export const resolvers = {
  Mutation: {
    register: async (_: any, { username, password }: { username: string, password: string }) => {
      try {
        const checkUserExists = await pool.query(
          'SELECT * FROM users WHERE username = $1',
          [username]
        );

        if (checkUserExists.rows.length > 0) {
          throw new Error('User already exists')
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const result = await pool.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
          [username, hashedPwd]
        );

        return { id: result.rows[0].id, username: result.rows[0].username };
      } catch (error) {
        console.error(error);
        throw new Error('Error registering user')
      }
    },

    login: async (_: any, { username, password }: { username: string, password: string }) => {
      try {
        const userResult = await pool.query(
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