INSERT INTO "instructors" ("name", "user_id")
SELECT DISTINCT "user"."name", "user"."id"
FROM "user"
JOIN "courses" ON "courses"."owner_id" = "user"."id";
--> statement-breakpoint
UPDATE "courses"
SET "instructor_id" = "instructors"."id"
FROM "instructors"
WHERE "instructors"."user_id" = "courses"."owner_id";