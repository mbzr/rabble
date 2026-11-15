import 'server-only'
import { PlaybackTokens, signPlaybackTokens } from './mux'
import { getCurrentUser } from './current-user'
import { db } from '@/db'
import { courses } from '@/db/schema/courses'
import { lessons } from '@/db/schema/lessons'
import { videos } from '@/db/schema/videos'
import { and, eq } from 'drizzle-orm'
import { enrolments } from '@/db/schema/enrolments'
import { canViewLesson } from './policies'

export type LessonPlayback =
  | { canView: true; playbackId: string; tokens: PlaybackTokens }
  | { canView: false }

export const getLessonPlayback = async (lessonId: string) => {
  const currentUser = await getCurrentUser()

  const [row] = await db
    .select({
      courseId: courses.id,
      ownerId: courses.ownerId,
      access: courses.access,
      isFreePreview: lessons.isFreePreview,
      playbackId: videos.muxPlaybackId,
    })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .innerJoin(
      videos,
      and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
    )
    .where(and(eq(lessons.id, lessonId), eq(lessons.status, 'published')))

  if (!row?.playbackId) return null

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
  if (!canView) return { canView: false }

  return {
    canView: true,
    playbackId: row.playbackId,
    tokens: await signPlaybackTokens(row.playbackId),
  }
}
