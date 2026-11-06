import { loadEnvConfig } from '@next/env'
import { logError } from '@/lib/log'

loadEnvConfig(process.cwd())

const SEED_INSTRUCTOR_ID = '00000000-0000-0000-0000-0000000000a1'

const seed = async () => {
  const { db } = await import('@/db')
  const { user } = await import('@/db/schema/auth')
  const { courses } = await import('@/db/schema/courses')

  try {
    await db
      .insert(user)
      .values({
        id: SEED_INSTRUCTOR_ID,
        name: 'Instructor name',
        email: 'instructor@rabble.invalid',
        emailVerified: true,
        role: 'instructor',
      })
      .onConflictDoNothing()

    await db
      .insert(courses)
      .values([
        {
          id: '00000000-0000-0000-0000-000000000001',
          ownerId: SEED_INSTRUCTOR_ID,
          slug: 'ui-design-fundamentals',
          title: 'UI design fundamentals',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          category: 'design',
          language: 'en',
          level: 'beginner',
          access: 'free',
          status: 'published',
          publishedAt: new Date('2026-11-02T09:00:00Z'),
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          ownerId: SEED_INSTRUCTOR_ID,
          slug: 'designing-interfaces-in-figma',
          title: 'Designing interfaces in Figma',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          category: 'design',
          language: 'en',
          level: 'intermediate',
          access: 'premium',
          status: 'published',
          publishedAt: new Date('2026-11-03T09:00:00Z'),
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          ownerId: SEED_INSTRUCTOR_ID,
          slug: 'design-systems-from-scratch',
          title: 'أنظمة التصميم من الصفر',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
          category: 'design',
          language: 'ar',
          level: 'intermediate',
          access: 'premium',
          status: 'published',
          publishedAt: new Date('2026-11-04T09:00:00Z'),
        },
      ])
      .onConflictDoNothing()
  } finally {
    await db.$client.end()
  }
}

seed().catch((error: unknown) => {
  logError(error, { script: 'db/seed' })
  process.exitCode = 1
})
