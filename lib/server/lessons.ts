import 'server-only'
import { type PlaybackTokens, signPlaybackTokens } from './mux'
import { type CurrentUser, getCurrentUser } from './current-user'
import { db } from '@/db'
import { courses } from '@/db/schema/courses'
import { lessons } from '@/db/schema/lessons'
import { videos } from '@/db/schema/videos'
import { and, eq } from 'drizzle-orm'
import { enrolments } from '@/db/schema/enrolments'
import { canViewLesson } from './policies'
import { lessonProgress } from '@/db/schema/lesson-progress'

export const COMPLETE_AT = 0.9 // 90% of time watched

export type LessonPlayback =
  | {
      canView: true
      playbackId: string
      tokens: PlaybackTokens
      startSeconds: number
      // visitors watching a preview can't save progress
      savesProgress: boolean
    }
  | { canView: false }

export const loadLessonAccess = async (
  lessonId: string,
  currentUser: CurrentUser | null,
) => {
  const [row] = await db
    .select({
      courseId: courses.id,
      ownerId: courses.ownerId,
      access: courses.access,
      isFreePreview: lessons.isFreePreview,
      playbackId: videos.muxPlaybackId,
      durationSeconds: videos.durationSeconds,
    })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .innerJoin(
      videos,
      and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
    )
    .where(and(eq(lessons.id, lessonId), eq(lessons.status, 'published')))

  if (!row?.playbackId || row.durationSeconds === null) return null

  const isEnrolled = currentUser
    ? (await db.$count(
        enrolments,
        and(
          eq(enrolments.courseId, row.courseId),
          eq(enrolments.userId, currentUser.id),
        ),
      )) > 0
    : false

  const canView = canViewLesson({
    user: currentUser,
    course: {
      ownerId: row.ownerId,
      access: row.access,
    },
    lesson: {
      isFreePreview: row.isFreePreview,
    },
    isEnrolled,
    hasPremiumAccess: false,
  })

  return {
    playbackId: row.playbackId,
    durationSeconds: row.durationSeconds,
    canView,
  }
}

export const getLessonPlayback = async (
  lessonId: string,
): Promise<LessonPlayback | null> => {
  const currentUser = await getCurrentUser()
  const lesson = await loadLessonAccess(lessonId, currentUser)

  if (!lesson) return null
  if (!lesson.canView) return { canView: false }

  const [progress] = currentUser
    ? await db
        .select({ positionSeconds: lessonProgress.positionSeconds })
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.lessonId, lessonId),
            eq(lessonProgress.userId, currentUser.id),
          ),
        )
    : []
  const saved = progress?.positionSeconds ?? 0

  return {
    canView: true,
    playbackId: lesson.playbackId,
    tokens: await signPlaybackTokens(lesson.playbackId),
    // watch from the last saved position if it's less than 90% of the lesson
    startSeconds: saved < lesson.durationSeconds * COMPLETE_AT ? saved : 0,
    savesProgress: currentUser !== null,
  }
}
