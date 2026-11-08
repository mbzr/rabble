import { randomUUID } from 'node:crypto'
import { db } from '@/db'
import { user } from '@/db/schema/auth'
import { courses } from '@/db/schema/courses'
import { lessons } from '@/db/schema/lessons'
import { videos } from '@/db/schema/videos'

export const createUser = async (
  values: Partial<typeof user.$inferInsert> = {},
) => {
  const result = await db
    .insert(user)
    .values({
      name: 'Test user',
      email: `${randomUUID()}@test.invalid`,
      emailVerified: true,
      role: 'learner',
      ...values,
    })
    .returning()

  const row = result[0]
  if (!row) throw new Error('insert returned no user')
  return row
}

interface CreateCourseParams extends Partial<typeof courses.$inferInsert> {
  owner: {
    id: string
  }
}

export const createCourse = async ({
  owner,
  ...values
}: CreateCourseParams) => {
  const result = await db
    .insert(courses)
    .values({
      ownerId: owner.id,
      slug: `course-${randomUUID()}`,
      title: 'Test course',
      description: 'Test description',
      category: 'design',
      language: 'en',
      level: 'beginner',
      access: 'free',
      status: 'published',
      publishedAt: new Date(),
      ...values,
    })
    .returning()

  const row = result[0]
  if (!row) throw new Error('insert returned no course')
  return row
}

interface CreateLessonParams extends Partial<typeof lessons.$inferInsert> {
  course: {
    id: string
  }
  video?: Partial<typeof videos.$inferInsert>
}

export const createLesson = async ({
  course,
  video,
  ...values
}: CreateLessonParams) => {
  const lessonResult = await db
    .insert(lessons)
    .values({
      courseId: course.id,
      slug: `lesson-${randomUUID()}`,
      title: 'Test lesson',
      description: 'Test description',
      position: 0,
      status: 'published',
      ...values,
    })
    .returning()
  const lesson = lessonResult[0]
  if (!lesson) throw new Error('insert returned no lesson')

  if (lesson && video) {
    await db.insert(videos).values({
      lessonId: lesson.id,
      status: 'ready',
      muxPlaybackId: `playback-${lesson.id}`,
      durationSeconds: 60,
      ...video,
    })
  }

  return lesson
}
