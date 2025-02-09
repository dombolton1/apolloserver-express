import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { RequestHandler } from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from '../src/schemas/index.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'securepassword';

interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options

  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      let user = null;

      if (token) {
        try {
          const decode = jwt.verify(token, JWT_SECRET);
          user = decode;
        } catch (error) {
          console.error('Invalid token', error);
        }
      }
      return { user };
    },
  }) as unknown as RequestHandler,
);

// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`Server ready at http://localhost:4000/`);