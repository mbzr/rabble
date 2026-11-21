import 'server-only'

import type { CourseAccess, CourseStatus } from '@/lib/schemas/course'
import { Role } from './current-user'

interface CourseForEnrolment {
  status: CourseStatus
  access: CourseAccess
  isSandbox: boolean
}

export const canEnrolInCourse = (course: CourseForEnrolment) =>
  course.status === 'published' && !course.isSandbox && course.access === 'free'

interface Viewer {
  id: string
  role: Role
}

// admins can edit courses, instructors their own
export const canEditCourse = (
  user: Viewer | null,
  course: { ownerId: string },
) => user !== null && (user.role === 'admin' || user.id === course.ownerId)

interface LessonViewing {
  user: Viewer | null
  course: { ownerId: string; access: CourseAccess }
  lesson: { isFreePreview: boolean }
  hasPremiumAccess: boolean
}

export const canViewLesson = ({
  user,
  course,
  lesson,
  hasPremiumAccess,
}: LessonViewing) => {
  if (lesson.isFreePreview || course.access === 'free') return true
  if (canEditCourse(user, course)) return true
  return user !== null && hasPremiumAccess
}
