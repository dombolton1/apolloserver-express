import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { RequestHandler } from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from '../src/schemas/index.js';
import { resolvers } from '../src/resolvers/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface MyContext {
  token?: string;
}

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  cache: 'bounded',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      let user = null;

      if (token) {
        try {
          const decode = jwt.verify(token, process.env.JWT_SECRET);
          user = decode;
          console.log(user)
        } catch (error) {
          console.error('Invalid token', error);
        }
      }
      return { user };
    },
  }) as unknown as RequestHandler,
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`Server ready at http://localhost:4000/`);