import { and, eq, isNull } from 'drizzle-orm'
import { lessonProgress } from '@/db/schema/lesson-progress'
import { requireUser } from './current-user'
import { ForbiddenError, NotFoundError } from './errors'
import { COMPLETE_AT, loadLessonAccess } from './lessons'
import { db } from '@/db'

export const saveLessonProgress = async (
  lessonId: string,
  positionSeconds: number,
) => {
  const currentUser = await requireUser()
  const lesson = await loadLessonAccess(lessonId, currentUser)
  if (!lesson) throw new NotFoundError('Lesson not found')
  if (!lesson.canView)
    throw new ForbiddenError('You do not have access to this lesson')

  // clamp the position to the lesson duration
  const position = Math.min(
    Math.max(0, Math.floor(positionSeconds)),
    lesson.durationSeconds,
  )

  await db
    .insert(lessonProgress)
    .values({
      userId: currentUser.id,
      lessonId,
      positionSeconds: position,
    })
    .onConflictDoUpdate({
      target: [lessonProgress.userId, lessonProgress.lessonId],
      set: { positionSeconds: position, updatedAt: new Date() },
    })

  // if the lesson is 90% watched, mark it as completed
  if (position >= lesson.durationSeconds * COMPLETE_AT) {
    await db
      .update(lessonProgress)
      .set({ completedAt: new Date() })
      .where(
        and(
          eq(lessonProgress.userId, currentUser.id),
          eq(lessonProgress.lessonId, lessonId),
          isNull(lessonProgress.completedAt),
        ),
      )
  }
}
