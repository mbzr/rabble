CREATE TABLE "lesson_progress" (
	"user_id" uuid,
	"lesson_id" uuid,
	"position_seconds" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_progress_pkey" PRIMARY KEY("user_id","lesson_id"),
	CONSTRAINT "lesson_progress_position_check" CHECK ("position_seconds" >= 0)
);
--> statement-breakpoint
CREATE INDEX "lesson_progress_user_updated_idx" ON "lesson_progress" ("user_id","updated_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;