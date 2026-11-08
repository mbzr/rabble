ALTER TABLE "videos" RENAME COLUMN "aspect_ration" TO "aspect_ratio";--> statement-breakpoint
ALTER TABLE "videos" RENAME COLUMN "caption_status" TO "captions_status";--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_slug_key";--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
DROP INDEX "courses_catalog_idx";--> statement-breakpoint
CREATE INDEX "courses_catalog_idx" ON "courses" ("published_at" DESC) WHERE "status" = 'published' and not "is_sandbox";--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_captions_status_check", ADD CONSTRAINT "videos_captions_status_check" CHECK ("captions_status" in ('none', 'generating', 'ready', 'errored'));