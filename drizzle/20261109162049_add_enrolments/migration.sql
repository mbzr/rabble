CREATE TABLE "enrolments" (
	"user_id" uuid,
	"course_id" uuid,
	"source" text DEFAULT 'self' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enrolments_pkey" PRIMARY KEY("user_id","course_id"),
	CONSTRAINT "enrolments_source_check" CHECK ("source" in ('self', 'seed', 'demo'))
);
--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "position" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;