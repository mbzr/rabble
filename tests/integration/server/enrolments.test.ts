import { getMyEnrolmentForCourse } from '@/lib/server/enrolments'
import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createEnrolment, createUser } from '@/tests/factories'
import { afterEach, describe, expect, test } from 'vitest'

describe('getMyEnrolmentForCourse', () => {
  afterEach(() => signOut())

  test('returns the enrolment for the signed-in learner', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner })
    await createEnrolment({ learner, course })

    await signInAs(learner)

    expect(await getMyEnrolmentForCourse(course.id)).toMatchObject({
      courseId: course.id,
    })
  })

  test('returns null when the learner is not enrolled', async () => {
    const owner = await createUser({ role: 'instructor' })
    const learner = await createUser()
    const course = await createCourse({ owner })

    await signInAs(learner)

    expect(await getMyEnrolmentForCourse(course.id)).toBeNull()
  })

  test('returns null for visitors', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner })

    expect(await getMyEnrolmentForCourse(course.id)).toBeNull()
  })
})
