import { type CatalogFilters } from '@/lib/schemas/course'
import {
  getCourseBySlug,
  listPublishedCourses,
  listRecentCourses,
} from '@/lib/server/courses'
import { createCourse, createLesson, createUser } from '@/tests/factories'
import { beforeAll, describe, expect, test } from 'vitest'

const getCoursesSlugs = async (filters: CatalogFilters) =>
  await listPublishedCourses(filters).then((courses) =>
    courses.map((course) => course.slug),
  )

const findCourseBySlug = async (slug: string) =>
  (await listPublishedCourses({})).find((course) => course.slug === slug)

describe('catalog queries', () => {
  beforeAll(async () => {
    const owner = await createUser({
      name: 'Ada',
      role: 'instructor',
    })

    const marketing = await createCourse({
      owner,
      slug: 'marketing-101',
      category: 'marketing',
      language: 'ar',
      publishedAt: new Date('2026-11-04T09:00:00Z'),
    })

    await createLesson({ course: marketing, video: { durationSeconds: 60 } })

    const figma = await createCourse({
      owner,
      slug: 'figma-101',
      category: 'design',
      access: 'premium',
      level: 'intermediate',
      publishedAt: new Date('2026-11-03T09:00:00Z'),
    })

    await createLesson({
      course: figma,
      position: 0,
      video: { durationSeconds: 120 },
    })
    await createLesson({
      course: figma,
      position: 1,
      video: { durationSeconds: 180 },
    })

    // counts as a lesson, but video isnt ready yet, so it adds no time
    await createLesson({
      course: figma,
      position: 2,
      video: {
        status: 'processing',
        muxPlaybackId: null,
        durationSeconds: null,
      },
    })

    // draft lesson, so it adds no time
    await createLesson({
      course: figma,
      position: 3,
      status: 'draft',
      video: { durationSeconds: 60 },
    })

    await createCourse({
      owner,
      slug: 'empty-course',
      category: 'design',
      publishedAt: new Date('2026-11-02T09:00:00Z'),
    })

    await createCourse({
      owner,
      slug: 'draft-course',
      status: 'draft',
      publishedAt: null,
    })

    await createCourse({
      owner,
      slug: 'archived-course',
      status: 'archived',
    })

    await createCourse({
      owner,
      slug: 'sandbox-course',
      isSandbox: true,
    })
  })

  test('list catalog courses newest first, leaving out drafts, archived, and sandboxes', async () => {
    expect(await getCoursesSlugs({})).toEqual([
      'marketing-101',
      'figma-101',
      'empty-course',
    ])
  })
  test('counts published lessons and only time of ready videos', async () => {
    expect(await findCourseBySlug('figma-101')).toMatchObject({
      lessonCount: 3,
      durationSeconds: 300,
    })
  })

  test('shows 0 lessons and 0 videos for empty course', async () => {
    expect(await findCourseBySlug('empty-course')).toMatchObject({
      lessonCount: 0,
      durationSeconds: 0,
    })
  })

  test('applies each filter', async () => {
    expect(await getCoursesSlugs({ category: 'design' })).toEqual([
      'figma-101',
      'empty-course',
    ])
    expect(await getCoursesSlugs({ language: 'ar' })).toEqual(['marketing-101'])
    expect(await getCoursesSlugs({ level: 'intermediate' })).toEqual([
      'figma-101',
    ])
    expect(await getCoursesSlugs({ access: 'premium' })).toEqual(['figma-101'])
    expect(
      await getCoursesSlugs({ category: 'marketing', access: 'premium' }),
    ).toEqual([])
  })

  test('ignores filters that are not set', async () => {
    expect(await getCoursesSlugs({ level: undefined })).toEqual([
      'marketing-101',
      'figma-101',
      'empty-course',
    ])
  })

  test('lists recently added courses newest first', async () => {
    const recent = await listRecentCourses()
    expect(recent.map((course) => course.slug)).toEqual([
      'marketing-101',
      'figma-101',
      'empty-course',
    ])
  })

  test('returns a course with its published lessons and ready videos', async () => {
    const course = await getCourseBySlug('figma-101')
    expect(
      course?.lessons.map((lesson) => [
        lesson.position,
        lesson.durationSeconds,
      ]),
    ).toEqual([
      [0, 120],
      [1, 180],
    ])
    expect(course).toMatchObject({ lessonCount: 2, durationSeconds: 300 })
  })

  test('never returns draft lessons', async () => {
    const course = await getCourseBySlug('figma-101')
    expect(course?.lessons.some((lesson) => lesson.position === 3)).toBe(false)
  })

  test('returns null for draft, archived, and sandbox courses', async () => {
    expect(await getCourseBySlug('draft-course')).toBeNull()
    expect(await getCourseBySlug('archived-course')).toBeNull()
    expect(await getCourseBySlug('sandbox-course')).toBeNull()
  })
})
