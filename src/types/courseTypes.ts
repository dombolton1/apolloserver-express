export type Course = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  outcome?: string[]
};

export type AddCourseArgs = {
  title: string;
  description: string;
  duration: number;
  outcome: string[];
};

export type UpdateCourseArgs = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  outcome?: string[];
};