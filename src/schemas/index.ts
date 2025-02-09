import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import {
  typeDefs as collectionTypeDefs,
  resolvers as collectionResolvers
} from './collectionSchema.js';
import {
  typeDefs as courseTypeDefs,
  resolvers as courseResolvers
} from './courseSchema.js';
import {
  typeDefs as userTypeDefs,
  resolvers as userResolvers
} from './userSchema.js';

export const typeDefs = mergeTypeDefs([collectionTypeDefs, courseTypeDefs, userTypeDefs]);

export const resolvers = mergeResolvers([collectionResolvers, courseResolvers, userResolvers]);