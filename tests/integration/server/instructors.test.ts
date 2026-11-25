import { getCourseBySlug } from '@/lib/server/courses'
import { createCourse, createInstructor, createUser } from '@/tests/factories'
import { describe, expect, test } from 'vitest'

describe('course credits', () => {
  test('shows the credited instructor, not the account that manages the course', async () => {
    const admin = await createUser({ role: 'admin', name: 'Admin account' })
    const instructor = await createInstructor({ name: 'Yahya Baz' })
    const course = await createCourse({ owner: admin, instructor })

    expect(await getCourseBySlug(course.slug)).toMatchObject({
      instructorName: 'Yahya Baz',
    })
  })
})
