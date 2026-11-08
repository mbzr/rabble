import { loadEnvConfig } from '@next/env'
import { logError } from '@/lib/log'

loadEnvConfig(process.cwd())

const SEED_INSTRUCTOR_ID = '00000000-0000-4000-8000-0000000000a1'

const seedId = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, '0')}`

// Mux development env sample videos
const EDUCATION_VIDEO = {
  muxAssetId: 'sC024aLVCQv99Jns01vkJ2ws0001KAbfrL4qS101cnQzkYzk',
  muxPlaybackId: 'S7qTRUQkpJt01k2QXQ02KIknml00AO8X025uBPPAjBcH02qc',
  durationSeconds: 25,
  captionTrackId: 'BTQR9JbqEPMGNg00kLsS92P2d9JXFdyNTRRPELOl3A1DHN4pqAdrnOQ',
}

const INFRASTRUCTURE_VIDEO = {
  muxAssetId: 'sDTQ003QtP5Ok6J3tFOAj73CIyp4h8lrg1Mbp1cOWnR4',
  muxPlaybackId: 'RbJD7502DiCRVg6sTgjYJ6SY6k00WJzdikXr7Sb01W5015o',
  durationSeconds: 25,
  captionTrackId: '3xz4KZ01U8uT11cJW3q67qB8Lsg8fLk1fAUbqUMppiUYf02pE5HOlnJQ',
}

const LESSONS_BY_COURSE = [
  {
    courseId: seedId(1),
    lessons: [
      {
        slug: 'what-makes-an-interface-clear',
        title: 'What makes an interface clear',
      },
      { slug: 'spacing-and-alignment', title: 'Spacing and alignment' },
      { slug: 'type-and-colour', title: 'Type and colour' },
    ],
  },
  {
    courseId: seedId(2),
    lessons: [
      { slug: 'auto-layout', title: 'Auto layout' },
      { slug: 'components-and-variants', title: 'Components and variants' },
      { slug: 'keeping-files-tidy', title: 'Keeping files tidy' },
    ],
  },
  {
    courseId: seedId(3),
    lessons: [
      { slug: 'what-is-a-design-system', title: 'ما هو نظام التصميم؟' },
      { slug: 'colour-and-type-tokens', title: 'الألوان والخطوط' },
      { slug: 'building-components', title: 'بناء المكوّنات' },
    ],
  },
]

const seed = async () => {
  const { db } = await import('@/db')
  const { user } = await import('@/db/schema/auth')
  const { courses } = await import('@/db/schema/courses')
  const { lessons } = await import('@/db/schema/lessons')
  const { videos } = await import('@/db/schema/videos')

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
          id: '00000000-0000-4000-8000-000000000001',
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
          id: '00000000-0000-4000-8000-000000000002',
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
          id: '00000000-0000-4000-8000-000000000003',
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

    const lessonRows = LESSONS_BY_COURSE.flatMap(
      ({ courseId, lessons: courseLessons }, courseIndex) =>
        courseLessons.map((lesson, position) => ({
          id: seedId(100 + courseIndex * 10 + position),
          courseId,
          slug: lesson.slug,
          title: lesson.title,
          position,
          isFreePreview: position === 0, // first lesson can be watched for free
          status: 'published' as const,
        })),
    )

    await db.insert(lessons).values(lessonRows).onConflictDoNothing()

    await db
      .insert(videos)
      .values(
        lessonRows.map((lesson, index) => ({
          id: seedId(200 + index),
          lessonId: lesson.id,
          ...(index % 2 === 0 ? EDUCATION_VIDEO : INFRASTRUCTURE_VIDEO),
          status: 'ready' as const,
          aspectRatio: '16:9',
          captionsStatus: 'ready' as const,
          isSample: true,
        })),
      )
      .onConflictDoNothing()
  } finally {
    await db.$client.end()
  }
}

seed().catch((error: unknown) => {
  logError(error, { script: 'db/seed' })
  process.exitCode = 1
})
