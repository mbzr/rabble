import { yoga } from '@/lib/graphql/yoga'
import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createUser } from '@/tests/factories'
import { afterEach, describe, expect, test } from 'vitest'

const STUDIO_COURSES = /* GraphQL */ `
  query StudioCourses {
    studioCourses {
      id
      status
    }
  }
`

const execute = async (query: string) => {
  const response = await yoga.fetch('http://localhost/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  return response.json()
}

describe('studioCourses', () => {
  afterEach(() => signOut())

  test('an instructor sees only their own courses', async () => {
    const instructor = await createUser({ role: 'instructor' })
    const other = await createUser({ role: 'instructor' })
    const mine = await createCourse({ owner: instructor, status: 'draft' })
    await createCourse({ owner: other })

    await signInAs(instructor)

    expect(await execute(STUDIO_COURSES)).toEqual({
      data: { studioCourses: [{ id: mine.id, status: 'DRAFT' }] },
    })
  })

  test('a learner is forbidden', async () => {
    await signInAs(await createUser())

    const result = await execute(STUDIO_COURSES)

    expect(result.errors[0].extensions.code).toBe('FORBIDDEN')
  })

  test('a visitor is unauthenticated', async () => {
    const result = await execute(STUDIO_COURSES)

    expect(result.errors[0].extensions.code).toBe('UNAUTHENTICATED')
  })
})
