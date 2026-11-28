import {
  createCourse,
  getStudioCourse,
  listStudioCourses,
  updateCourse,
} from '@/lib/server/courses'
import { createInstructor, listInstructors } from '@/lib/server/instructors'
import type { Resolvers } from './generated/resolvers'

export const resolvers: Resolvers = {
  Query: {
    studioCourses: () => listStudioCourses(),
    studioCourse: (_parent, { id }) => getStudioCourse(id),
    instructors: () => listInstructors(),
  },
  Mutation: {
    createCourse: (_parent, { input }) => createCourse(input),
    updateCourse: (_parent, { id, input }) => updateCourse(id, input),
    createInstructor: (_parent, { name }) => createInstructor(name),
  },
  Course: {
    updatedAt: (course) => course.updatedAt.toISOString(),
    instructor: (course) => ({
      id: course.instructorId,
      name: course.instructorName,
    }),
  },
  // graphQL enum values are uppercase, the database values are lowercase
  CourseStatus: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },
  CourseAccess: { FREE: 'free', PREMIUM: 'premium' },
  CourseCategory: {
    DEVELOPMENT: 'development',
    DESIGN: 'design',
    BUSINESS: 'business',
    MARKETING: 'marketing',
    PHOTO_VIDEO: 'photo-video',
    PERSONAL_DEVELOPMENT: 'personal-development',
  },
  CourseLanguage: { EN: 'en', AR: 'ar' },
  CourseLevel: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
  },
}
