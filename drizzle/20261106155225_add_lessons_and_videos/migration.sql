CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_free_preview" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_course_id_slug_key" UNIQUE("course_id","slug"),
	CONSTRAINT "lessons_status_check" CHECK ("status" in ('draft', 'published', 'archived')),
	CONSTRAINT "lessons_position_check" CHECK ("position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lesson_id" uuid NOT NULL UNIQUE,
	"mux_upload_id" text NOT NULL UNIQUE,
	"mux_asset_id" text,
	"mux_playback_id" text,
	"status" text DEFAULT 'waiting_for_upload' NOT NULL,
	"duration_seconds" integer,
	"aspect_ration" text,
	"caption_status" text DEFAULT 'none' NOT NULL,
	"caption_track_id" text,
	"error_message" text,
	"is_sample" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "videos_status_check" CHECK ("status" in ('waiting_for_upload', 'processing', 'ready', 'errored')),
	CONSTRAINT "videos_captions_status_check" CHECK ("caption_status" in ('none', 'generating', 'ready', 'errored')),
	CONSTRAINT "videos_ready_check" CHECK ("status" <> 'ready' or ("mux_playback_id" is not null and "duration_seconds" is not null))
);
--> statement-breakpoint
CREATE INDEX "lessons_course_id_position_idx" ON "lessons" ("course_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "videos_mux_asset_id_key" ON "videos" ("mux_asset_id") WHERE not "is_sample";--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;