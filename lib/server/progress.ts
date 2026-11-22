import 'server-only'
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import { lessonProgress } from '@/db/schema/lesson-progress'
import { getCurrentUser, requireUser } from './current-user'
import { ForbiddenError, NotFoundError } from './errors'
import { COMPLETE_AT, loadLessonAccess } from './lessons'
import { db } from '@/db'
import { enrolments } from '@/db/schema/enrolments'
import { lessons } from '@/db/schema/lessons'
import { courses } from '@/db/schema/courses'
import { videos } from '@/db/schema/videos'

export const saveLessonProgress = async (
  lessonId: string,
  lastPositionSeconds: number,
) => {
  const currentUser = await requireUser()
  const lesson = await loadLessonAccess(lessonId, currentUser)
  if (!lesson) throw new NotFoundError('Lesson not found')
  if (!lesson.canView)
    throw new ForbiddenError('You do not have access to this lesson')

  // clamp the position to the lesson duration
  const position = Math.min(
    Math.max(0, Math.floor(lastPositionSeconds)),
    lesson.durationSeconds,
  )

  await db
    .insert(lessonProgress)
    .values({
      userId: currentUser.id,
      lessonId,
      lastPositionSeconds: position,
    })
    .onConflictDoUpdate({
      target: [lessonProgress.userId, lessonProgress.lessonId],
      set: { lastPositionSeconds: position, updatedAt: new Date() },
    })

  await db
    .insert(enrolments)
    .values({ userId: currentUser.id, courseId: lesson.courseId })
    .onConflictDoNothing()

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

// the lessons users finished in this course
export const listCompletedLessonIds = async (
  courseId: string,
): Promise<string[]> => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return []

  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .where(
      and(
        eq(lessonProgress.userId, currentUser.id),
        eq(lessons.courseId, courseId),
        isNotNull(lessonProgress.completedAt),
      ),
    )

  return rows.map((row) => row.lessonId)
}

// the last lesson user started but didnt't finish
export const getContinueWatching = async () => {
  const currentUser = await requireUser()

  const [row] = await db
    .select({
      courseSlug: courses.slug,
      courseTitle: courses.title,
      courseLanguage: courses.language,
      lessonSlug: lessons.slug,
      lessonTitle: lessons.title,
      lastPositionSeconds: lessonProgress.lastPositionSeconds,
      durationSeconds: videos.durationSeconds,
    })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .innerJoin(
      videos,
      and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
    )
    .where(
      and(
        eq(lessonProgress.userId, currentUser.id),
        isNull(lessonProgress.completedAt),
        eq(lessons.status, 'published'),
      ),
    )
    .orderBy(desc(lessonProgress.updatedAt))
    .limit(1)

  return row ?? null
}
