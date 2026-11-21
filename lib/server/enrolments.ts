import 'server-only'
import { getCurrentUser } from './current-user'
import { db } from '@/db'
import { and, eq } from 'drizzle-orm'
import { enrolments } from '@/db/schema/enrolments'

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
