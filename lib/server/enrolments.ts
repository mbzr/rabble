import 'server-only'
import { getCurrentUser, requireUser } from './current-user'
import { db } from '@/db'
import { courses } from '@/db/schema/courses'
import { and, eq } from 'drizzle-orm'
import { ForbiddenError, NotFoundError } from './errors'
import { canEnrollInCourse } from './policies'
import { enrolments } from '@/db/schema/enrolments'

export const enrollInCourse = async (courseId: string) => {
  const user = await requireUser()

  const [course] = await db
    .select({
      status: courses.status,
      access: courses.access,
      isSandbox: courses.isSandbox,
    })
    .from(courses)
    .where(eq(courses.id, courseId))

  if (!course) throw new NotFoundError('Course not found')
  if (!canEnrollInCourse(course))
    throw new ForbiddenError('You cannot enroll in this course')

  await db
    .insert(enrolments)
    .values({ userId: user.id, courseId })
    .onConflictDoNothing()
}

export const getMyEnrolmentForCourse = async (
  courseId: string,
): Promise<{ courseId: string; enrolledAt: Date } | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const [enrolment] = await db
    .select({
      courseId: enrolments.courseId,
      enrolledAt: enrolments.createdAt,
    })
    .from(enrolments)
    .where(
      and(eq(enrolments.userId, user.id), eq(enrolments.courseId, courseId)),
    )

  return enrolment ?? null
}
