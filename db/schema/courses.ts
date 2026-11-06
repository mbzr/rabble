import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import {
  COURSE_ACCESS,
  COURSE_CATEGORIES,
  COURSE_LANGUAGES,
  COURSE_LEVELS,
  COURSE_STATUSES,
} from '@/lib/schemas/course'
import { sqlList } from '@/db/sql-list'

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').references(() => user.id, {
      onDelete: 'restrict',
    }),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    category: text('category', { enum: COURSE_CATEGORIES }).notNull(),
    language: text('language', { enum: COURSE_LANGUAGES }).notNull(),
    level: text('level', { enum: COURSE_LEVELS }).notNull(),
    access: text('access', { enum: COURSE_ACCESS }).notNull(),
    status: text('status', { enum: COURSE_STATUSES })
      .notNull()
      .default('draft'),
    coverImageKey: text('cover_image_key'),
    isSandbox: boolean('is_sandbox').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      'courses_category_check',
      sql`${table.category} in (${sqlList(COURSE_CATEGORIES)})`,
    ),
    check(
      'courses_language_check',
      sql`${table.language} in (${sqlList(COURSE_LANGUAGES)})`,
    ),
    check(
      'courses_level_check',
      sql`${table.level} in (${sqlList(COURSE_LEVELS)})`,
    ),
    check(
      'courses_access_check',
      sql`${table.access} in (${sqlList(COURSE_ACCESS)})`,
    ),
    check(
      'courses_status_check',
      sql`${table.status} in (${sqlList(COURSE_STATUSES)})`,
    ),
    index('courses_catalog_idx')
      .on(table.publishedAt.desc())
      .where(sql`${table.status} = 'published' and not ${table.isSandbox}`),
  ],
)
