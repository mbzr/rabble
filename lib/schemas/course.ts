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

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]
export type CourseLanguage = (typeof COURSE_LANGUAGES)[number]
export type CourseLevel = (typeof COURSE_LEVELS)[number]
export type CourseAccess = (typeof COURSE_ACCESS)[number]
export type CourseStatus = (typeof COURSE_STATUSES)[number]

export const catalogFiltersSchema = z.object({
  category: z.enum(COURSE_CATEGORIES).optional().catch(undefined),
  language: z.enum(COURSE_LANGUAGES).optional().catch(undefined),
  level: z.enum(COURSE_LEVELS).optional().catch(undefined),
  access: z.enum(COURSE_ACCESS).optional().catch(undefined),
})

export type CatalogFilters = z.infer<typeof catalogFiltersSchema>
