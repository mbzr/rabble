import {
  enrollInCourse,
  getMyEnrolmentForCourse,
} from '@/lib/server/enrolments'
import {
  ForbiddenError,
  NotFoundError,
  UnauthenticatedError,
} from '@/lib/server/errors'
import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createUser } from '@/tests/factories'
import { randomUUID } from 'crypto'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'

let learner: { id: string }
let freeCourse: { id: string }
let premiumCourse: { id: string }
let draftCourse: { id: string }

describe('enrolments', () => {
  beforeAll(async () => {
    const owner = await createUser({ role: 'instructor' })
    learner = await createUser()
    freeCourse = await createCourse({ owner })
    premiumCourse = await createCourse({ owner, access: 'premium' })
    draftCourse = await createCourse({
      owner,
      status: 'draft',
      publishedAt: null,
    })
  })

  afterEach(() => signOut())

  test('a logged in learner can enrol in a free course', async () => {
    await signInAs(learner)
    await enrollInCourse(freeCourse.id)

    expect(await getMyEnrolmentForCourse(freeCourse.id)).toMatchObject({
      courseId: freeCourse.id,
    })
  })

  test('enolling twice changes nothing', async () => {
    await signInAs(learner)
    await enrollInCourse(freeCourse.id)
    const firstEnrolment = await getMyEnrolmentForCourse(freeCourse.id)
    await enrollInCourse(freeCourse.id)

    expect(await getMyEnrolmentForCourse(freeCourse.id)).toEqual(firstEnrolment)
  })

  test('refuses visitors', async () => {
    await expect(enrollInCourse(freeCourse.id)).rejects.toThrow(
      UnauthenticatedError,
    )
  })

  test('refuses Premium course enrolments until subscription is active', async () => {
    await signInAs(learner)
    await expect(enrollInCourse(premiumCourse.id)).rejects.toThrow(
      ForbiddenError,
    )
  })

  test('refuses Draft course enrolments', async () => {
    await signInAs(learner)
    await expect(enrollInCourse(draftCourse.id)).rejects.toThrow(ForbiddenError)
  })

  test('refuses courses that do no exist', async () => {
    await signInAs(learner)
    await expect(enrollInCourse(randomUUID())).rejects.toThrow(NotFoundError)
  })

  test('returns null for a course that the learner is not enrolled in', async () => {
    expect(await getMyEnrolmentForCourse(freeCourse.id)).toBeNull()

    await signInAs(learner)
    expect(await getMyEnrolmentForCourse(premiumCourse.id)).toBeNull()
  })
})
