import {
  check,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { courses } from './courses'
import { sqlList } from '../sql-list'
import { sql } from 'drizzle-orm'

export const ENROLMENT_SOURCES = ['self', 'seed', 'demo'] as const

export const enrolments = pgTable(
  'enrolments',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    source: text('source', { enum: ENROLMENT_SOURCES })
      .notNull()
      .default('self'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.courseId] }),
    check(
      'enrolments_source_check',
      sql`${table.source} in (${sqlList(ENROLMENT_SOURCES)})`,
    ),
  ],
)
