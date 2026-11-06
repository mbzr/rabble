CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"owner_id" uuid,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"language" text NOT NULL,
	"level" text NOT NULL,
	"access" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"cover_image_key" text,
	"is_sandbox" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_category_check" CHECK ("category" in ('development', 'design', 'business', 'marketing', 'photo-video', 'personal-development')),
	CONSTRAINT "courses_language_check" CHECK ("language" in ('en', 'ar')),
	CONSTRAINT "courses_level_check" CHECK ("level" in ('beginner', 'intermediate', 'advanced')),
	CONSTRAINT "courses_access_check" CHECK ("access" in ('free', 'premium')),
	CONSTRAINT "courses_status_check" CHECK ("status" in ('draft', 'published', 'archived'))
);
--> statement-breakpoint
CREATE INDEX "courses_catalog_idx" ON "courses" ("published_at" DESC NULLS LAST) WHERE "status" = 'published' and not "is_sandbox";--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT;