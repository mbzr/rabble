import { afterEach, describe, expect, test } from 'vitest'
import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createEnrolment, createUser } from '@/tests/factories'
import { listMyCourses } from '@/lib/server/courses'
import { UnauthenticatedError } from '@/lib/server/errors'

describe('listMyCourses', () => {
  afterEach(() => signOut())

  test('lists only your courses, newest enrolment first', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const otherLearner = await createUser()
    const older = await createCourse({ owner })
    const newer = await createCourse({ owner })
    const someoneElses = await createCourse({ owner })
    await createEnrolment({
      learner,
      course: older,
      createdAt: new Date('2026-01-01'),
    })
    await createEnrolment({
      learner,
      course: newer,
      createdAt: new Date('2026-02-01'),
    })
    await createEnrolment({ learner: otherLearner, course: someoneElses })

    await signInAs(learner)

    const myCourses = await listMyCourses()

    expect(myCourses.map((course) => course.id)).toEqual([newer.id, older.id])
  })

  test('keeps a course archive after you enrolled', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const archived = await createCourse({ owner, status: 'archived' })
    await createEnrolment({ learner, course: archived })

    await signInAs(learner)

    expect(await listMyCourses()).toMatchObject([{ id: archived.id }])
  })

  test('refuses visitors', async () => {
    await expect(listMyCourses()).rejects.toThrow(UnauthenticatedError)
  })
})
