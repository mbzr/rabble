import { db } from '@/db'
import { lessonProgress } from '@/db/schema/lesson-progress'
import { ForbiddenError, UnauthenticatedError } from '@/lib/server/errors'
import { saveLessonProgress } from '@/lib/server/progress'
import { signInAs, signOut } from '@/tests/auth'
import {
  createCourse,
  createEnrolment,
  createLesson,
  createUser,
} from '@/tests/factories'
import { and, eq } from 'drizzle-orm'
import { afterEach, describe, expect, test } from 'vitest'

const setup = async () => {
  const owner = await createUser({ role: 'instructor' })
  const learner = await createUser()
  const course = await createCourse({ owner })
  const lesson = await createLesson({ course, video: { durationSeconds: 60 } })
  await createEnrolment({ course, learner })
  await signInAs(learner)
  return { learner, lesson }
}

const readProgress = async (userId: string, lessonId: string) => {
  const [row] = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.lessonId, lessonId),
        eq(lessonProgress.userId, userId),
      ),
    )
  return row
}

describe('saveLessonProgress', () => {
  afterEach(() => signOut())

  test('should save progress', async () => {
    const { learner, lesson } = await setup()
    await saveLessonProgress(lesson.id, 30)
    const progress = await readProgress(learner.id, lesson.id)
    expect(progress).toMatchObject({
      lastPositionSeconds: 30,
      completedAt: null,
    })
  })

  test('should clamp progress to the lesson duration', async () => {
    const { learner, lesson } = await setup()
    await saveLessonProgress(lesson.id, 120)
    const progress = await readProgress(learner.id, lesson.id)
    expect(progress).toMatchObject({
      lastPositionSeconds: 60,
    })
  })

  test('should mark the lesson as completed if 90% of it is watched', async () => {
    const { learner, lesson } = await setup()
    await saveLessonProgress(lesson.id, 54)
    const completed = await readProgress(learner.id, lesson.id)
    expect(await readProgress(learner.id, lesson.id)).toMatchObject({
      completedAt: completed?.completedAt,
    })
  })

  test('refuses a lesson you cannot watch', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner, access: 'premium' })
    const lesson = await createLesson({ course, video: {} })
    await createEnrolment({ learner, course })
    await signInAs(learner)
    await expect(saveLessonProgress(lesson.id, 30)).rejects.toThrow(
      ForbiddenError,
    )
  })

  test('refuses visitors', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner })
    const lesson = await createLesson({ course, video: {} })

    await expect(saveLessonProgress(lesson.id, 10)).rejects.toThrow(
      UnauthenticatedError,
    )
  })
})
