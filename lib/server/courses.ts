import 'server-only'

import { cacheTag, revalidateTag } from 'next/cache'
import { and, asc, count, desc, eq, not, sum } from 'drizzle-orm'
import {
  COURSE_CATEGORIES,
  courseDetailsSchema,
  type CatalogFilters,
  type CourseAccess,
  type CourseCategory,
  type CourseLanguage,
  type CourseLevel,
} from '@/lib/schemas/course'
import { courses } from '@/db/schema/courses'
import { lessons } from '@/db/schema/lessons'
import { db } from '@/db'
import { videos } from '@/db/schema/videos'
import { CurrentUser, requireRole, requireUser } from './current-user'
import { enrolments } from '@/db/schema/enrolments'
import { instructors } from '@/db/schema/instructors'
import { ForbiddenError, NotFoundError, ValidationError } from './errors'
import { resolveCourseInstructor } from './instructors'
import { canEditCourse } from './policies'
import { z } from 'zod'

export interface CourseSummary {
  id: string
  slug: string
  title: string
  description: string
  category: CourseCategory
  language: CourseLanguage
  level: CourseLevel
  access: CourseAccess
  lessonCount: number
  durationSeconds: number
  instructorName: string
}

const RECENT_COURSES_LIMIT = 6

const isInCatalog = and(eq(courses.status, 'published'), not(courses.isSandbox))

interface CourseSummaryRow extends Omit<
  CourseSummary,
  'lessonCount' | 'durationSeconds'
> {
  lessonCount: number | null
  durationSeconds: string | null
}

const lessonTotals = db
  .select({
    courseId: lessons.courseId,
    lessonCount: count(lessons.id).as('lesson_count'),
    durationSeconds: sum(videos.durationSeconds).as('duration_seconds'),
  })
  .from(lessons)
  .innerJoin(
    videos,
    and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
  )
  .where(eq(lessons.status, 'published'))
  .groupBy(lessons.courseId)
  .as('lesson_totals')

const selectCourseSummaries = () => {
  return db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      category: courses.category,
      language: courses.language,
      level: courses.level,
      access: courses.access,
      instructorName: instructors.name,
      lessonCount: lessonTotals.lessonCount,
      durationSeconds: lessonTotals.durationSeconds,
    })
    .from(courses)
    .innerJoin(instructors, eq(instructors.id, courses.instructorId))
    .leftJoin(lessonTotals, eq(lessonTotals.courseId, courses.id))
}

const toCourseSummary = (row: CourseSummaryRow): CourseSummary => ({
  ...row,
  lessonCount: Number(row.lessonCount ?? 0),
  durationSeconds: Number(row.durationSeconds ?? 0),
})

export const listRecentCourses = async (): Promise<CourseSummary[]> => {
  'use cache'
  cacheTag('catalog')

  const rows = await selectCourseSummaries()
    .where(isInCatalog)
    .orderBy(desc(courses.publishedAt))
    .limit(RECENT_COURSES_LIMIT)

  return rows.map(toCourseSummary)
}

export const listPublishedCourses = async (
  filters: CatalogFilters,
): Promise<CourseSummary[]> => {
  'use cache'
  cacheTag('catalog')

  const rows = await selectCourseSummaries()
    .where(
      and(
        isInCatalog,
        filters.category ? eq(courses.category, filters.category) : undefined,
        filters.language ? eq(courses.language, filters.language) : undefined,
        filters.level ? eq(courses.level, filters.level) : undefined,
        filters.access ? eq(courses.access, filters.access) : undefined,
      ),
    )
    .orderBy(desc(courses.publishedAt))

  return rows.map(toCourseSummary)
}

export const listCatalogCategories = async (): Promise<CourseCategory[]> => {
  'use cache'
  cacheTag('catalog')

  const rows = await db
    .selectDistinct({ category: courses.category })
    .from(courses)
    .where(isInCatalog)
  const categories = new Set(rows.map((row) => row.category))

  return COURSE_CATEGORIES.filter((category) => categories.has(category))
}

export interface LessonSummary {
  id: string
  slug: string
  title: string
  description?: string
  position: number
  isFreePreview: boolean
  // Null while the video is still processing
  durationSeconds: number | null
}

export interface CourseDetail extends CourseSummary {
  lessons: LessonSummary[]
}

export const getCourseBySlug = async (
  slug: string,
): Promise<CourseDetail | null> => {
  'use cache'
  cacheTag('catalog')

  const [course] = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      category: courses.category,
      language: courses.language,
      level: courses.level,
      access: courses.access,
      instructorName: instructors.name,
    })
    .from(courses)
    .innerJoin(instructors, eq(instructors.id, courses.instructorId))
    .where(and(eq(courses.slug, slug), isInCatalog))

  if (!course) return null
  cacheTag(`course:${course.id}`)

  const courseLessons = await db
    .select({
      id: lessons.id,
      slug: lessons.slug,
      title: lessons.title,
      description: lessons.description,
      position: lessons.position,
      isFreePreview: lessons.isFreePreview,
      durationSeconds: videos.durationSeconds,
    })
    .from(lessons)
    .innerJoin(
      videos,
      and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
    )
    .where(
      and(eq(lessons.courseId, course.id), eq(lessons.status, 'published')),
    )
    .orderBy(asc(lessons.position))

  return {
    ...course,
    lessons: courseLessons,
    lessonCount: courseLessons.length,
    durationSeconds: courseLessons.reduce(
      (total, lesson) => total + (lesson.durationSeconds ?? 0),
      0,
    ),
  }
}

export const listMyCourses = async (): Promise<CourseSummary[]> => {
  const currentUser = await requireUser()

  const rows = await selectCourseSummaries()
    .innerJoin(enrolments, eq(enrolments.courseId, courses.id))
    .where(eq(enrolments.userId, currentUser.id))
    .orderBy(desc(enrolments.createdAt))

  return rows.map(toCourseSummary)
}

export const listCatalogLessonPaths = async () => {
  'use cache'
  cacheTag('catalog')

  return db
    .select({ slug: courses.slug, lessonSlug: lessons.slug })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .innerJoin(
      videos,
      and(eq(videos.lessonId, lessons.id), eq(videos.status, 'ready')),
    )
    .where(and(isInCatalog, eq(lessons.status, 'published')))
}

// the fields the studio shows and edits
const selectStudioCourses = () =>
  db
    .select({
      id: courses.id,
      ownerId: courses.ownerId,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      category: courses.category,
      language: courses.language,
      level: courses.level,
      access: courses.access,
      status: courses.status,
      updatedAt: courses.updatedAt,
      instructorId: courses.instructorId,
      instructorName: instructors.name,
      lessonCount: db.$count(lessons, eq(lessons.courseId, courses.id)),
      enrolmentCount: db.$count(
        enrolments,
        eq(enrolments.courseId, courses.id),
      ),
    })
    .from(courses)
    .innerJoin(instructors, eq(instructors.id, courses.instructorId))

// the studio dashboard: your courses, or every course for an admin, most recently edited first
export const listStudioCourses = async () => {
  const currentUser = await requireRole('instructor', 'admin')

  return selectStudioCourses()
    .where(
      currentUser.role === 'admin'
        ? not(courses.isSandbox)
        : eq(courses.ownerId, currentUser.id),
    )
    .orderBy(desc(courses.updatedAt))
}

export type StudioCourse = Awaited<ReturnType<typeof listStudioCourses>>[number]

// A course you may edit. Audit #3: only its owner or an admin
const loadEditableCourse = async (
  currentUser: CurrentUser,
  courseId: string,
) => {
  if (!z.uuid().safeParse(courseId).success) {
    throw new NotFoundError('Course not found')
  }

  const [course] = await selectStudioCourses().where(eq(courses.id, courseId))
  if (!course) throw new NotFoundError('Course not found')
  if (!canEditCourse(currentUser, course)) throw new ForbiddenError()

  return course
}

export const getStudioCourse = async (courseId: string) =>
  loadEditableCourse(await requireUser(), courseId)

const parseCourseDetails = (input: unknown) => {
  const parsed = courseDetailsSchema.safeParse(input)
  if (!parsed.success) {
    throw new ValidationError(
      Object.fromEntries(
        parsed.error.issues.map((issue) => [issue.path.join('.'), issue.code]),
      ),
    )
  }
  return parsed.data
}

// postgres reports a duplicate slug as a unique violation, code 23505
const isUniqueViolation = (error: unknown) =>
  error instanceof Error &&
  (error.cause as { code?: string } | undefined)?.code === '23505'

// only instructors and admins create courses. Every new course starts as a draft
export const createCourse = async (input: unknown) => {
  const currentUser = await requireRole('instructor', 'admin')
  const { instructorId, ...details } = parseCourseDetails(input)
  const creditedId = await resolveCourseInstructor(currentUser, instructorId)

  try {
    const [created] = await db
      .insert(courses)
      .values({
        ...details,
        ownerId: currentUser.id,
        instructorId: creditedId,
        status: 'draft',
        isSandbox: currentUser.isDemo,
      })
      .returning({ id: courses.id })
    if (!created) throw new Error('insert returned no course')

    return loadEditableCourse(currentUser, created.id)
  } catch (error) {
    if (isUniqueViolation(error)) throw new ValidationError({ slug: 'taken' })
    throw error
  }
}

export const updateCourse = async (courseId: string, input: unknown) => {
  const currentUser = await requireUser()
  const course = await loadEditableCourse(currentUser, courseId)
  const { instructorId, ...details } = parseCourseDetails(input)

  // published links never break, the slug only changes while the course is a draft
  if (details.slug !== course.slug && course.status !== 'draft') {
    throw new ValidationError({ slug: 'locked' })
  }

  const values = {
    ...details,
    // admins can change who is credited. Instructors keep their own credit
    ...(currentUser.role === 'admin' &&
      instructorId && {
        instructorId: await resolveCourseInstructor(currentUser, instructorId),
      }),
  }

  try {
    await db.update(courses).set(values).where(eq(courses.id, courseId))
  } catch (error) {
    if (isUniqueViolation(error)) throw new ValidationError({ slug: 'taken' })
    throw error
  }

  // learners see published courses, so refresh their cached pages now
  if (course.status === 'published') {
    revalidateTag('catalog', { expire: 0 })
    revalidateTag(`course:${courseId}`, { expire: 0 })
  }

  return loadEditableCourse(currentUser, courseId)
}
