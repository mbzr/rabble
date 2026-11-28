import { z } from 'zod'

export const COURSE_CATEGORIES = [
  'development',
  'design',
  'business',
  'marketing',
  'photo-video',
  'personal-development',
] as const
export const COURSE_LANGUAGES = ['en', 'ar'] as const
export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export const COURSE_ACCESS = ['free', 'premium'] as const
export const COURSE_STATUSES = ['draft', 'published', 'archived'] as const
export const LESSON_STATUSES = ['draft', 'published', 'archived'] as const

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]
export type CourseLanguage = (typeof COURSE_LANGUAGES)[number]
export type CourseLevel = (typeof COURSE_LEVELS)[number]
export type CourseAccess = (typeof COURSE_ACCESS)[number]
export type CourseStatus = (typeof COURSE_STATUSES)[number]
export type LessonStatus = (typeof LESSON_STATUSES)[number]

export const catalogFiltersSchema = z.object({
  category: z.enum(COURSE_CATEGORIES).optional().catch(undefined),
  language: z.enum(COURSE_LANGUAGES).optional().catch(undefined),
  level: z.enum(COURSE_LEVELS).optional().catch(undefined),
  access: z.enum(COURSE_ACCESS).optional().catch(undefined),
})

export type CatalogFilters = z.infer<typeof catalogFiltersSchema>

// lowercase words joined by single hyphens, like "ui-design-fundamentals"
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const courseDetailsSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(80).regex(SLUG_PATTERN),
  description: z.string().trim().max(2000),
  category: z.enum(COURSE_CATEGORIES),
  language: z.enum(COURSE_LANGUAGES),
  level: z.enum(COURSE_LEVELS),
  access: z.enum(COURSE_ACCESS),
  // admins choose who is credited. Ignored for instructors, who are credited to themselves
  instructorId: z.uuid().optional(),
})

export type CourseDetailsInput = z.infer<typeof courseDetailsSchema>
