'use client'

import { useQuery } from '@apollo/client/react'
import { ClapperboardIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { type FragmentType, useFragment } from '@/lib/graphql/generated/client'
import { StudioCourseRowFragment, StudioCoursesQuery } from './queries'
import { Link } from '@/i18n/navigation'

interface StudioCourseRowProps {
  course: FragmentType<typeof StudioCourseRowFragment>
}

const StudioCourseRow = ({ course: courseRef }: StudioCourseRowProps) => {
  const course = useFragment(StudioCourseRowFragment, courseRef)
  const t = useTranslations('Studio')
  const format = useFormatter()

  return (
    <li className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
      <Link
        href={`/studio/courses/${course.id}`}
        className="flex-1 font-medium underline-offset-4 hover:underline"
        dir="auto"
      >
        {course.title}
      </Link>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'outline'}>
          {t(`status.${course.status}`)}
        </Badge>
        <Badge variant="outline">{t(`access.${course.access}`)}</Badge>
        <span className="text-muted-foreground">
          {t('lessonCount', { count: course.lessonCount })} ·{' '}
          {t('learnerCount', { count: course.enrolmentCount })} ·{' '}
          {t('updated', {
            date: format.dateTime(new Date(course.updatedAt), {
              dateStyle: 'medium',
            }),
          })}
        </span>
      </div>
    </li>
  )
}

export const StudioCourses = () => {
  const t = useTranslations('Studio')
  // the studio fetches in the browser. The server only renders the loading state
  const { data, loading, error } = useQuery(StudioCoursesQuery, { ssr: false })

  if (loading) {
    return (
      <div className="flex flex-col gap-2" aria-busy>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('loadError')}</AlertDescription>
      </Alert>
    )
  }

  if (data.studioCourses.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClapperboardIcon />
          </EmptyMedia>
          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyBody')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="divide-y rounded-xl border">
      {data.studioCourses.map((course) => (
        <StudioCourseRow key={course.id} course={course} />
      ))}
    </ul>
  )
}
