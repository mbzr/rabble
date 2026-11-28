import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createUser } from '@/tests/factories'
import { executeGraphQL } from '@/tests/graphql'
import { afterEach, describe, expect, test } from 'vitest'

const STUDIO_COURSES = /* GraphQL */ `
  query StudioCourses {
    studioCourses {
      id
      status
    }
  }
`

describe('studioCourses', () => {
  afterEach(() => signOut())

  test('an instructor sees only their own courses', async () => {
    const instructor = await createUser({ role: 'instructor' })
    const other = await createUser({ role: 'instructor' })
    const mine = await createCourse({ owner: instructor, status: 'draft' })
    await createCourse({ owner: other })

    await signInAs(instructor)

    expect(await executeGraphQL(STUDIO_COURSES)).toEqual({
      data: { studioCourses: [{ id: mine.id, status: 'DRAFT' }] },
    })
  })

  test('a learner is forbidden', async () => {
    await signInAs(await createUser())

    const result = await executeGraphQL(STUDIO_COURSES)

    expect(result.errors[0].extensions.code).toBe('FORBIDDEN')
  })

  test('a visitor is unauthenticated', async () => {
    const result = await executeGraphQL(STUDIO_COURSES)

    expect(result.errors[0].extensions.code).toBe('UNAUTHENTICATED')
  })
})
