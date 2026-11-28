import { signInAs, signOut } from '@/tests/auth'
import { createCourse, createInstructor, createUser } from '@/tests/factories'
import { executeGraphQL } from '@/tests/graphql'
import { afterEach, describe, expect, test } from 'vitest'

const CREATE_COURSE = /* GraphQL */ `
  mutation CreateCourse($input: CourseDetailsInput!) {
    createCourse(input: $input) {
      id
      slug
      status
      category
      instructor {
        name
      }
    }
  }
`

const UPDATE_COURSE = /* GraphQL */ `
  mutation UpdateCourse($id: ID!, $input: CourseDetailsInput!) {
    updateCourse(id: $id, input: $input) {
      title
    }
  }
`

const details = (overrides: Record<string, string> = {}) => ({
  title: 'Typography basics',
  slug: `typography-${crypto.randomUUID().slice(0, 8)}`,
  description: '',
  category: 'PHOTO_VIDEO',
  language: 'EN',
  level: 'BEGINNER',
  access: 'FREE',
  ...overrides,
})

describe('createCourse', () => {
  afterEach(() => signOut())

  test('an instructor creates a draft, credited to themselves', async () => {
    await signInAs(await createUser({ role: 'instructor', name: 'Mona Saleh' }))
    const input = details()

    const result = await executeGraphQL(CREATE_COURSE, { input })

    expect(result.data.createCourse).toMatchObject({
      slug: input.slug,
      status: 'DRAFT',
      category: 'PHOTO_VIDEO',
      instructor: { name: 'Mona Saleh' },
    })
  })

  test('an instructor cannot credit someone else', async () => {
    const someoneElse = await createInstructor({ name: 'Someone else' })
    await signInAs(await createUser({ role: 'instructor', name: 'Mona Saleh' }))

    const result = await executeGraphQL(CREATE_COURSE, {
      input: details({ instructorId: someoneElse.id }),
    })

    expect(result.data.createCourse.instructor.name).toBe('Mona Saleh')
  })

  test('an admin credits an instructor without an account', async () => {
    const instructor = await createInstructor({ name: 'Yahya Baz' })
    await signInAs(await createUser({ role: 'admin' }))

    const result = await executeGraphQL(CREATE_COURSE, {
      input: details({ instructorId: instructor.id }),
    })

    expect(result.data.createCourse.instructor.name).toBe('Yahya Baz')
  })

  test('an admin has to choose who is credited', async () => {
    await signInAs(await createUser({ role: 'admin' }))

    const result = await executeGraphQL(CREATE_COURSE, { input: details() })

    expect(result.errors[0].extensions.fieldErrors).toEqual({
      instructorId: 'required',
    })
  })

  test('a learner is forbidden', async () => {
    await signInAs(await createUser())

    const result = await executeGraphQL(CREATE_COURSE, { input: details() })

    expect(result.errors[0].extensions.code).toBe('FORBIDDEN')
  })

  test('invalid fields come back as field errors', async () => {
    await signInAs(await createUser({ role: 'instructor' }))

    const result = await executeGraphQL(CREATE_COURSE, {
      input: details({ title: 'ab', slug: 'Not A Slug' }),
    })

    expect(result.errors[0].extensions).toMatchObject({
      code: 'BAD_USER_INPUT',
      fieldErrors: { title: 'too_small', slug: 'invalid_format' },
    })
  })

  test('a taken slug is a field error', async () => {
    const instructor = await createUser({ role: 'instructor' })
    const existing = await createCourse({ owner: instructor })
    await signInAs(instructor)

    const result = await executeGraphQL(CREATE_COURSE, {
      input: details({ slug: existing.slug }),
    })

    expect(result.errors[0].extensions.fieldErrors).toEqual({ slug: 'taken' })
  })
})

describe('updateCourse', () => {
  afterEach(() => signOut())

  // Audit #3: any signed-in user could edit any course
  test("another instructor can't edit your course", async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner })
    await signInAs(await createUser({ role: 'instructor' }))

    const result = await executeGraphQL(UPDATE_COURSE, {
      id: course.id,
      input: details({ slug: course.slug }),
    })

    expect(result.errors[0].extensions.code).toBe('FORBIDDEN')
  })

  test('an admin can edit any course', async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner })
    await signInAs(await createUser({ role: 'admin' }))

    const result = await executeGraphQL(UPDATE_COURSE, {
      id: course.id,
      input: details({ slug: course.slug, title: 'Renamed by an admin' }),
    })

    expect(result.data.updateCourse.title).toBe('Renamed by an admin')
  })

  test("a published course's slug can't change", async () => {
    const owner = await createUser({ role: 'instructor' })
    const course = await createCourse({ owner, status: 'published' })
    await signInAs(owner)

    const result = await executeGraphQL(UPDATE_COURSE, {
      id: course.id,
      input: details({ slug: 'a-brand-new-slug' }),
    })

    expect(result.errors[0].extensions.fieldErrors).toEqual({ slug: 'locked' })
  })
})

describe('createInstructor', () => {
  afterEach(() => signOut())

  test('a learner cannot create instructors', async () => {
    await signInAs(await createUser())

    const result = await executeGraphQL(/* GraphQL */ `
      mutation {
        createInstructor(name: "Anyone") {
          id
        }
      }
    `)

    expect(result.errors[0].extensions.code).toBe('FORBIDDEN')
  })
})
