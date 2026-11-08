import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { lessons } from './lessons'
import { sqlList } from '../sql-list'

export const VIDEO_STATUSES = [
  'waiting_for_upload',
  'processing',
  'ready',
  'errored',
] as const
export const CAPTION_STATUSES = [
  'none',
  'generating',
  'ready',
  'errored',
] as const

export const videos = pgTable(
  'videos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id')
      .notNull()
      .unique()
      .references(() => lessons.id, {
        onDelete: 'cascade', // automatically delete all videos when the lesson is deleted
      }),
    muxUploadId: text('mux_upload_id').unique(),
    muxAssetId: text('mux_asset_id'),
    muxPlaybackId: text('mux_playback_id'),
    status: text('status', { enum: VIDEO_STATUSES })
      .notNull()
      .default('waiting_for_upload'),
    durationSeconds: integer('duration_seconds'),
    aspectRatio: text('aspect_ratio'),
    captionsStatus: text('captions_status', { enum: CAPTION_STATUSES })
      .notNull()
      .default('none'),
    captionTrackId: text('caption_track_id'),
    errorMessage: text('error_message'),
    isSample: boolean('is_sample').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('videos_mux_asset_id_key')
      .on(table.muxAssetId)
      .where(sql`not ${table.isSample}`), // mux asset id must be unique for not sample videos
    check(
      'videos_status_check',
      sql`${table.status} in (${sqlList(VIDEO_STATUSES)})`,
    ),
    check(
      'videos_captions_status_check',
      sql`${table.captionsStatus} in (${sqlList(CAPTION_STATUSES)})`,
    ),
    check(
      'videos_ready_check',
      sql`${table.status} <> 'ready' or (${table.muxPlaybackId} is not null and ${table.durationSeconds} is not null)`,
    ),
  ],
)
