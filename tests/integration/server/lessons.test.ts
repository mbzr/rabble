import { getLessonPlayback } from '@/lib/server/lessons'
import { saveLessonProgress } from '@/lib/server/progress'
import { signInAs, signOut } from '@/tests/auth'
import {
  createCourse,
  createEnrolment,
  createLesson,
  createUser,
} from '@/tests/factories'
import { afterEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/lib/server/mux', () => ({
  signPlaybackTokens: async (playbackId: string) => ({
    playback: `playback-${playbackId}`,
    thumbnail: `thumbnail-${playbackId}`,
    storyboard: `storyboard-${playbackId}`,
  }),
}))

describe('getLessonPlayback', () => {
  afterEach(() => signOut())

  test('visitor can view free preview on premium course', async () => {
    const onwer = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner: onwer, access: 'premium' })
    const lesson = await createLesson({
      course,
      isFreePreview: true,
      video: {},
    })

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      canView: true,
    })
  })

  test('an enrolled learner can watch a free course', async () => {
    const onwer = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner: onwer, access: 'free' })
    const lesson = await createLesson({
      course,
      video: {},
    })
    await createEnrolment({ learner, course })

    await signInAs(learner)

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      canView: true,
    })
  })

  test('a non-enrolled learner cannot watch a premium course', async () => {
    const onwer = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner: onwer, access: 'premium' })
    const lesson = await createLesson({
      course,
      video: {},
    })
    await createEnrolment({ learner, course })

    await signInAs(learner)

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      canView: false,
    })
  })

  test('an instructor can watch their own course', async () => {
    const onwer = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner: onwer, access: 'premium' })
    const lesson = await createLesson({
      course,
      video: {},
    })

    await signInAs(onwer)

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      canView: true,
    })
  })

  test('resumes where you left off', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner })
    const lesson = await createLesson({
      course,
      video: { durationSeconds: 60 },
    })
    await createEnrolment({ learner, course })
    await signInAs(learner)

    await saveLessonProgress(lesson.id, 25)

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      startSeconds: 25,
      savesProgress: true,
    })
  })

  test('starts again from the beginning after finishing', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner })
    const lesson = await createLesson({
      course,
      video: { durationSeconds: 60 },
    })
    await createEnrolment({ learner, course })
    await signInAs(learner)

    await saveLessonProgress(lesson.id, 58)

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      startSeconds: 0,
    })
  })
})
