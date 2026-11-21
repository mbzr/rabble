import { Suspense } from 'react'
import { BookOpenIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CourseDetail,
  getCourseBySlug,
  listPublishedCourses,
} from '@/lib/server/courses'
import { CourseAction } from './course-action'
import { LessonPlayer } from '@/components/lesson/lesson-player'
import { getPreviewPlayback } from '@/lib/server/lessons'
import { cn } from 'cn'

type CoursePageProps = PageProps<'/[locale]/courses/[slug]'>

export const generateStaticParams = async () => {
  const catalogCourses = await listPublishedCourses({})

  return catalogCourses.length > 0
    ? catalogCourses.map((course) => ({ slug: course.slug }))
    : [{ slug: 'placeholder' }]
}

export const generateMetadata = async ({ params }: CoursePageProps) => {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return {}

  return {
    title: course.title,
    description: course.description,
  }
}

interface CoursePreviewProps {
  lesson: CourseDetail['lessons'][number]
  language: string
}

// Signed per request, like the lesson page, so it streams in after the cached header
const CoursePreview = async ({ lesson, language }: CoursePreviewProps) => {
  const [playback, t] = await Promise.all([
    getPreviewPlayback(lesson.id),
    getTranslations('Course'),
  ])
  if (!playback) return null

  return (
    <figure className="flex flex-col gap-2">
      <LessonPlayer
        lessonId={lesson.id}
        playbackId={playback.playbackId}
        tokens={playback.tokens}
        title={lesson.title}
        startSeconds={0}
        savesProgress={false}
      />
      <figcaption className="text-muted-foreground text-sm">
        Preview:{' '}
        <span lang={language} dir="auto">
          {lesson.title}
        </span>
      </figcaption>
    </figure>
  )
}

const CoursePage = async ({ params }: CoursePageProps) => {
  const { slug } = await params
  const [course, t, tCatalog] = await Promise.all([
    getCourseBySlug(slug),
    getTranslations('Course'),
    getTranslations('Catalog'),
  ])
  if (!course) notFound()
  // a free course previews lesson 1. A Premium course previews its first free preview, if any
  const previewLesson =
    course.access === 'free'
      ? course.lessons[0]
      : course.lessons.find((lesson) => lesson.isFreePreview)

  return (
    <div className="flex flex-col gap-12">
      <header
        className={cn(
          'grid gap-8',
          previewLesson && 'md:grid-cols-2 md:items-start',
        )}
      >
        <div className="flex max-w-prose flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            {tCatalog(`categories.${course.category}`)} ·{' '}
            {tCatalog(`levels.${course.level}`)} ·{' '}
            {tCatalog(`languages.${course.language}`)}
          </p>
          <h1
            className="text-3xl font-semibold"
            lang={course.language}
            dir="auto"
          >
            {course.title}
          </h1>
          <p lang={course.language} dir="auto">
            {course.description}
          </p>
          <p className="text-muted-foreground text-sm">
            {tCatalog.rich('byInstructor', {
              name: course.instructorName,
              bdi: (chunks) => <bdi>{chunks}</bdi>,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant={course.access === 'free' ? 'secondary' : 'default'}>
              {tCatalog(`accessTypes.${course.access}`)}
            </Badge>
            <span>
              {tCatalog('lessonCount', { count: course.lessonCount })} ·{' '}
              {tCatalog('minutes', {
                count: Math.ceil(course.durationSeconds / 60),
              })}
            </span>
          </div>
          <Suspense fallback={<Skeleton className="h-10 w-40" />}>
            <CourseAction course={course} />
          </Suspense>
        </div>
        {previewLesson ? (
          <Suspense
            fallback={<Skeleton className="aspect-video w-full rounded-lg" />}
          >
            <CoursePreview lesson={previewLesson} language={course.language} />
          </Suspense>
        ) : null}
      </header>

      <section
        aria-labelledby="course-outline"
        className="flex max-w-prose flex-col gap-4"
      >
        <h2 id="course-outline" className="text-xl font-semibold">
          {t('outline')}
        </h2>
        {course.lessons.length > 0 ? (
          <ol className="divide-y rounded-xl border">
            {course.lessons.map((lesson, index) => (
              <li key={lesson.id} className="flex items-center gap-4 p-4">
                <span
                  className="text-muted-foreground text-sm tabular-nums"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span
                  className="flex-1 font-medium"
                  lang={course.language}
                  dir="auto"
                >
                  {lesson.title}
                </span>
                {lesson.isFreePreview ? (
                  <Badge variant="outline">{t('freePreview')}</Badge>
                ) : null}
                {lesson.durationSeconds !== null ? (
                  <span className="text-muted-foreground text-sm">
                    {tCatalog('minutes', {
                      count: Math.ceil(lesson.durationSeconds / 60),
                    })}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>{t('noLessonsTitle')}</EmptyTitle>
              <EmptyDescription>{t('noLessonsBody')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </div>
  )
}

export default CoursePage
