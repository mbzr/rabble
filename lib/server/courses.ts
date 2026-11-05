import 'server-only'

import { cacheTag } from 'next/cache'
import {
  COURSE_CATEGORIES,
  type CatalogFilters,
  type CourseAccess,
  type CourseCategory,
  type CourseLanguage,
  type CourseLevel,
} from '@/lib/schemas/course'

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

// TODO: replace by a real query
const courses: CourseSummary[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'ui-design-fundamentals',
    title: 'UI design fundamentals',
    description:
      'Layout, spacing, type and colour: the decisions behind interfaces that feel clear and calm.',
    category: 'design',
    language: 'en',
    level: 'beginner',
    access: 'free',
    lessonCount: 8,
    durationSeconds: 3000,
    instructorName: 'Instructor name',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    slug: 'designing-interfaces-in-figma',
    title: 'Designing interfaces in Figma',
    description:
      'Auto layout, components and variants, so your designs stay consistent as they grow.',
    category: 'design',
    language: 'en',
    level: 'intermediate',
    access: 'premium',
    lessonCount: 10,
    durationSeconds: 4500,
    instructorName: 'Instructor name',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    slug: 'design-systems-from-scratch',
    title: 'أنظمة التصميم من الصفر',
    description:
      'ابنِ نظام تصميم صغيرًا بالألوان والخطوط والمكوّنات، وتعلّم كيف يحافظ على اتساق واجهاتك.',
    category: 'design',
    language: 'ar',
    level: 'intermediate',
    access: 'premium',
    lessonCount: 9,
    durationSeconds: 3900,
    instructorName: 'Instructor name',
  },
]

export const listPublishedCourses = async (
  filters: CatalogFilters,
): Promise<CourseSummary[]> => {
  'use cache'
  cacheTag('catalog')

  return courses.filter(
    (course) =>
      (!filters.category || course.category === filters.category) &&
      (!filters.language || course.language === filters.language) &&
      (!filters.level || course.level === filters.level) &&
      (!filters.access || course.access === filters.access),
  )
}

export const listCatalogCategories = async (): Promise<CourseCategory[]> => {
  'use cache'
  cacheTag('catalog')

  return COURSE_CATEGORIES.filter((category) =>
    courses.some((course) => course.category === category),
  )
}
