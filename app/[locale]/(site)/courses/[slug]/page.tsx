import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getCourseBySlug } from '@/lib/server/courses'
import { BookOpenIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

type CoursePageProps = PageProps<'/[locale]/courses/[slug]'>

const CoursePage = async ({ params }: CoursePageProps) => {
  const { slug } = await params
  const [course, t, tCatalog] = await Promise.all([
    getCourseBySlug(slug),
    getTranslations('Course'),
    getTranslations('Catalog'),
  ])
  if (!course) notFound()

  return (
    <div className="flex flex-col gap-12">
      <header className="flex max-w-prose flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {' '}
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
