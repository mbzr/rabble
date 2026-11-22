import { listStudioCourses } from '@/lib/server/courses'

export const resolvers = {
  Query: {
    studioCourses: () => listStudioCourses(),
  },
  Course: {
    updatedAt: (course: { updatedAt: Date }) => course.updatedAt.toISOString(),
  },
  CourseStatus: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },
  CourseAccess: { FREE: 'free', PREMIUM: 'premium' },
}
