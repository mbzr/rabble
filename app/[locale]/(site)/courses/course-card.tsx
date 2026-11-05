import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import type { CourseSummary } from '@/lib/server/courses'

interface CourseCardProps {
  course: CourseSummary
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const t = useTranslations('Catalog')
  const minutes = Math.round(course.durationSeconds / 60)

  return (
    <article className="bg-card relative flex h-full flex-col overflow-hidden rounded-xl border">
      <div className="bg-muted aspect-video" aria-hidden />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-muted-foreground text-sm">
          {t(`categories.${course.category}`)} · {t(`levels.${course.level}`)} ·{' '}
          {t(`languages.${course.language}`)}
        </p>
        <h2
          className="line-clamp-2 text-base font-semibold"
          lang={course.language}
          dir="auto"
        >
          <Link
            href={`/courses/${course.slug}`}
            className="after:absolute after:inset-0"
          >
            {course.title}
          </Link>
        </h2>
        <p
          className="text-muted-foreground line-clamp-2 text-sm"
          lang={course.language}
          dir="auto"
        >
          {course.description}
        </p>
        <p className="text-muted-foreground text-sm">
          {t.rich('byInstructor', {
            name: course.instructorName,
            bdi: (chunks) => <bdi>{chunks}</bdi>,
          })}
        </p>
        <p className="mt-auto flex items-center justify-between gap-4 pt-2 text-sm">
          <span>
            {t('lessonCount', { count: course.lessonCount })} ·{' '}
            {t('minutes', { count: minutes })}
          </span>
          <Badge
            variant={course.access === 'premium' ? 'default' : 'secondary'}
          >
            {t(`accessTypes.${course.access}`)}
          </Badge>
        </p>
      </div>
    </article>
  )
}
