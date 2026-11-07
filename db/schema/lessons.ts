import { LESSON_STATUSES } from '@/lib/schemas/course'
import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { courses } from './courses'
import { sqlList } from '../sql-list'

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade', // automatically delete all lessons when the course is deleted
      }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    position: integer('position').notNull().default(0),
    isFreePreview: boolean('is_free_preview').notNull().default(false),
    status: text('status', { enum: LESSON_STATUSES })
      .notNull()
      .default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('lessons_course_id_slug_key').on(table.courseId, table.slug),
    index('lessons_course_id_position_idx').on(table.courseId, table.position),
    check(
      'lessons_status_check',
      sql`${table.status} in (${sqlList(LESSON_STATUSES)})`,
    ),
    check('lessons_position_check', sql`${table.position} >= 0`),
  ],
)
