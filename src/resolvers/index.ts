import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as collectionResolvers } from './collection.js';
import { resolvers as courseResolvers } from './course.js';
import { resolvers as userResolvers } from './user.js';

export const resolvers = mergeResolvers([collectionResolvers, courseResolvers, userResolvers]);