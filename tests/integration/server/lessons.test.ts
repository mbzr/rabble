import { getLessonPlayback, getPreviewPlayback } from '@/lib/server/lessons'
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

  test('a visitor can watch any lesson of a Free course', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner, access: 'free' })
    const lesson = await createLesson({
      course,
      video: {},
    })

    expect(await getLessonPlayback(lesson.id)).toMatchObject({
      canView: true,
      savesProgress: false,
    })
  })

  test('a visitor gets no tokens for a Premium lesson', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner, access: 'premium' })
    const lesson = await createLesson({
      course,
      video: {},
    })

    expect(await getLessonPlayback(lesson.id)).toEqual({ canView: false })
  })

  test('a learner without a subscription cannot watch a premium course', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner, access: 'premium' })
    const lesson = await createLesson({
      course,
      video: {},
    })

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

describe('getPreviewPlayback', () => {
  afterEach(() => signOut())

  test('plays a lesson of a Free course', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner })
    const lesson = await createLesson({ course, video: {} })

    expect(await getPreviewPlayback(lesson.id)).toMatchObject({
      tokens: { playback: expect.any(String) },
    })
  })

  test('never plays a Premium lesson, even for its owner', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner, access: 'premium' })
    const lesson = await createLesson({ course, video: {} })

    await signInAs(owner)

    expect(await getPreviewPlayback(lesson.id)).toBeNull()
  })
})
