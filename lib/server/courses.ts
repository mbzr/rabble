import 'server-only'

import { cacheTag } from 'next/cache'
import { and, asc, count, desc, eq, not, sum } from 'drizzle-orm'
import {
  COURSE_CATEGORIES,
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
import { user } from '@/db/schema/auth'
import { requireUser } from './current-user'
import { enrolments } from '@/db/schema/enrolments'

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
  .leftJoin(
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
      instructorName: user.name,
      lessonCount: lessonTotals.lessonCount,
      durationSeconds: lessonTotals.durationSeconds,
    })
    .from(courses)
    .innerJoin(user, eq(user.id, courses.ownerId))
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
      instructorName: user.name,
    })
    .from(courses)
    .innerJoin(user, eq(user.id, courses.ownerId))
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
