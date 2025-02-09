import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as collectionTypeDefs } from './collectionSchema.js';
import { typeDefs as courseTypeDefs } from './courseSchema.js';
import { typeDefs as userTypeDefs } from './userSchema.js';

export const typeDefs = mergeTypeDefs([collectionTypeDefs, courseTypeDefs, userTypeDefs]);
