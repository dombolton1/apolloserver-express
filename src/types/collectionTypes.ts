import { Course } from './courseTypes.js'

export type Collection = {
  id: string;
  name: string;
};

export type CollectionWithCourses = Collection & {
  courses: Course[];
}