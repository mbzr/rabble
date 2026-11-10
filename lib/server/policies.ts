import 'server-only'

import type { CourseAccess, CourseStatus } from '@/lib/schemas/course'

interface CourseForEnrolment {
  status: CourseStatus
  access: CourseAccess
  isSandbox: boolean
}

export const canEnrolInCourse = (course: CourseForEnrolment) =>
  course.status === 'published' && !course.isSandbox && course.access === 'free'
