import 'server-only'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { instructors } from '@/db/schema/instructors'
import { type CurrentUser, requireRole } from './current-user'
import { ValidationError } from './errors'

const instructorNameSchema = z.string().trim().min(2).max(100)

// the instructor picker on the course form. Admins only
export const listInstructors = async () => {
  await requireRole('admin')

  return db
    .select({ id: instructors.id, name: instructors.name })
    .from(instructors)
    .orderBy(asc(instructors.name))
}

// an instructor without an account
export const createInstructor = async (name: unknown) => {
  await requireRole('admin')
  const parsed = instructorNameSchema.safeParse(name)
  if (!parsed.success) {
    throw new ValidationError({
      name: parsed.error.issues[0]?.code ?? 'invalid',
    })
  }

  const [created] = await db
    .insert(instructors)
    .values({ name: parsed.data })
    .returning({ id: instructors.id, name: instructors.name })
  if (!created) throw new Error('insert returned no instructor')

  return created
}

// who a course is credited to
export const resolveCourseInstructor = async (
  currentUser: CurrentUser,
  requestedId: string | undefined,
) => {
  // admins choose who a course is credited to
  if (currentUser.role === 'admin') {
    if (!requestedId) throw new ValidationError({ instructorId: 'required' })
    const exists =
      (await db.$count(instructors, eq(instructors.id, requestedId))) > 0
    if (!exists) throw new ValidationError({ instructorId: 'not_found' })
    return requestedId
  }

  // their own instructor row, created the first time they make a course
  await db
    .insert(instructors)
    .values({ name: currentUser.name, userId: currentUser.id })
    .onConflictDoNothing()
  const [own] = await db
    .select({ id: instructors.id })
    .from(instructors)
    .where(eq(instructors.userId, currentUser.id))
  if (!own) throw new Error('instructor row missing')

  return own.id
}
