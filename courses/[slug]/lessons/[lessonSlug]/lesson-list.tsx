import { CircleCheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import type { CourseDetail } from '@/lib/server/courses'

interface LessonListProps {
  course: CourseDetail
  currentLessonId: string
  completedLessonIds: string[]
}

export const LessonList = ({
  course,
  currentLessonId,
  completedLessonIds,
}: LessonListProps) => {
  const t = useTranslations('Lesson')
  const tCourse = useTranslations('Course')
  const tCatalog = useTranslations('Catalog')

  return (
    <ol className="divide-y rounded-xl border">
      {course.lessons.map((item, index) => {
        const isCompleted = completedLessonIds.includes(item.id)

        return (
          <li key={item.id}>
            <Link
              href={`/courses/${course.slug}/lessons/${item.slug}`}
              aria-current={item.id === currentLessonId ? 'page' : undefined}
              className="hover:bg-accent aria-[current=page]:bg-accent flex items-center gap-3 p-3 text-sm"
            >
              {isCompleted ? (
                <CircleCheckIcon className="text-primary size-4" aria-hidden />
              ) : (
                <span
                  className="text-muted-foreground w-4 text-center tabular-nums"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
              <span className="flex-1" lang={course.language} dir="auto">
                {item.title}
                {isCompleted ? (
                  <span className="sr-only">, {t('completed')}</span>
                ) : null}
              </span>
              {item.isFreePreview ? (
                <Badge variant="outline">{tCourse('freePreview')}</Badge>
              ) : null}
              {item.durationSeconds !== null ? (
                <span className="text-muted-foreground">
                  {tCatalog('minutes', {
                    count: Math.ceil(item.durationSeconds / 60),
                  })}
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
