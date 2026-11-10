import 'server-only'

import type { CourseAccess, CourseStatus } from '@/lib/schemas/course'

interface EnrollableCourse {
  status: CourseStatus
  access: CourseAccess
  isSandbox: boolean
}

export const canEnrolInCourse = (course: EnrollableCourse) =>
  course.status === 'published' && !course.isSandbox && course.access === 'free'
