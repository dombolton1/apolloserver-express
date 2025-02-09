import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Course {
    id: ID!
    title: String!
    description: String
    duration: Float!
    outcome: [String]
  }

  enum SortingOrder {
    ASC
    DESC
  }

  type Query {
    getCourseById(id: ID!): Course
    getAllCourses(limit: Int, sortingOrder: SortingOrder): [Course!]
  }


  type Mutation {
    addCourse(
      title: String!,
      description: String,
      duration: Float!,
      outcome: [String]
    ): Course!
    deleteCourse(id: ID!): Course!
    updateCourse(
      id: ID!,
      title: String,
      description: String,
      duration: Float,
      outcome: [String]
    ): Course!
  }
`;
