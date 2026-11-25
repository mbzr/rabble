import { listStudioCourses } from '@/lib/server/courses'
import type { Resolvers } from './generated/resolvers'

export const resolvers: Resolvers = {
  Query: {
    studioCourses: () => listStudioCourses(),
  },
  Course: {
    updatedAt: (course) => course.updatedAt.toISOString(),
  },
  CourseStatus: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },
  CourseAccess: { FREE: 'free', PREMIUM: 'premium' },
}
