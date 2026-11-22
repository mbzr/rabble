import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { LockIcon } from 'lucide-react'
import { getLessonPlayback } from '@/lib/server/lessons'
import { LessonPlayer } from '@/components/lesson/lesson-player'
import { CourseAction } from '../../course-action'
import {
  type CourseDetail,
  getCourseBySlug,
  listCatalogLessonPaths,
} from '@/lib/server/courses'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { withNext } from '@/lib/safe-next'
import { LessonList } from '@/courses/[slug]/lessons/[lessonSlug]/lesson-list'
import { listCompletedLessonIds } from '@/lib/server/progress'

type LessonPageProps =
  PageProps<'/[locale]/courses/[slug]/lessons/[lessonSlug]'>
type Lesson = CourseDetail['lessons'][number]

export const generateStaticParams = async () => {
  const paths = await listCatalogLessonPaths()
  return paths.length > 0
    ? paths
    : [{ slug: 'placeholder', lessonSlug: 'placeholder' }]
}

const findLesson = async (slug: string, lessonSlug: string) => {
  const course = await getCourseBySlug(slug)
  const lesson = course?.lessons.find((l) => l.slug === lessonSlug)
  if (!course || !lesson) return null
  return { course, lesson }
}

export const generateMetadata = async ({ params }: LessonPageProps) => {
  const { slug, lessonSlug } = await params
  const found = await findLesson(slug, lessonSlug)
  if (!found) return {}

  return { title: `${found.lesson.title} · ${found.course.title}` }
}

interface LessonVideoProps {
  course: CourseDetail
  lesson: Lesson
}

interface LessonListWithProgressProps {
  course: CourseDetail
  currentLessonId: string
}

const LessonListWithProgress = async ({
  course,
  currentLessonId,
}: LessonListWithProgressProps) => (
  <LessonList
    course={course}
    currentLessonId={currentLessonId}
    completedLessonIds={await listCompletedLessonIds(course.id)}
  />
)

const LessonVideo = async ({ course, lesson }: LessonVideoProps) => {
  const [playback, t] = await Promise.all([
    getLessonPlayback(lesson.id),
    getTranslations('Lesson'),
  ])
  if (!playback) return null

  if (!playback.canView) {
    return (
      <div className="bg-muted flex aspect-video flex-col items-center justify-center gap-4 rounded-lg p-6 text-center">
        <LockIcon className="text-muted-foreground size-8" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{t('lockedTitle')}</p>
          <p className="text-muted-foreground text-sm">{t('lockedBody')}</p>
        </div>
        <CourseAction course={course} lessonSlug={lesson.slug} />
      </div>
    )
  }

  if (!playback.playbackId) return null

  return (
    <div className="flex flex-col gap-2">
      <LessonPlayer
        lessonId={lesson.id}
        playbackId={playback.playbackId}
        tokens={playback.tokens}
        title={lesson.title}
        startSeconds={playback.startSeconds}
        savesProgress={playback.savesProgress}
      />
      {playback.savesProgress ? null : (
        <p className="text-muted-foreground text-sm">
          <Link
            href={withNext(
              '/login',
              `/courses/${course.slug}/lessons/${lesson.slug}`,
            )}
            className="text-primary underline underline-offset-4"
          >
            {t('signInToSaveProgress')}
          </Link>
        </p>
      )}
    </div>
  )
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { slug, lessonSlug } = await params
  const [found, t, tCourse, tCatalog] = await Promise.all([
    findLesson(slug, lessonSlug),
    getTranslations('Lesson'),
    getTranslations('Course'),
    getTranslations('Catalog'),
  ])
  if (!found) return notFound()

  const { course, lesson } = found

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Suspense
          fallback={<Skeleton className="aspect-video w-full rounded-lg" />}
        >
          <LessonVideo course={course} lesson={lesson} />
        </Suspense>

        <div className="flex flex-col gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="text-muted-foreground text-sm underline-offset-4 hover:underline"
            lang={course.language}
            dir="auto"
          >
            {course.title}
          </Link>
          <h1
            className="text-2xl font-semibold"
            lang={course.language}
            dir="auto"
          >
            {lesson.title}
          </h1>
          {lesson.description ? (
            <p lang={course.language} dir="auto">
              {lesson.description}
            </p>
          ) : null}
        </div>
      </div>
      <Suspense
        fallback={
          <LessonList
            course={course}
            currentLessonId={lesson.id}
            completedLessonIds={[]}
          />
        }
      >
        <LessonListWithProgress course={course} currentLessonId={lesson.id} />
      </Suspense>
    </div>
  )
}

export default LessonPage
