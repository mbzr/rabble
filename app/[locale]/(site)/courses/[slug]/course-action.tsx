import { CourseDetail } from '@/lib/server/courses'
import { getCurrentUser } from '@/lib/server/current-user'
import { getMyEnrolmentForCourse } from '@/lib/server/enrolments'
import { getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { withNext } from '@/lib/safe-next'
import { EnrolButton } from './enrol-button'

interface CourseActionProps {
  course: CourseDetail
  lessonSlug?: string
}

export const CourseAction = async ({
  course,
  lessonSlug,
}: CourseActionProps) => {
  const [user, enrolment, t] = await Promise.all([
    getCurrentUser(),
    getMyEnrolmentForCourse(course.id),
    getTranslations('Course'),
  ])
  const lesson = lessonSlug
    ? course.lessons.find((l) => l.slug === lessonSlug)
    : course.lessons[0]
  if (!lesson) return null

  const lessonHref = `/courses/${course.slug}/lessons/${lesson.slug}`
  const returnPath = lessonSlug ? lessonHref : `/courses/${course.slug}`

  if (!user) {
    return (
      <Link
        href={withNext('/login', returnPath)}
        className={buttonVariants({ size: 'lg' })}
      >
        {t('signInToStart')}
      </Link>
    )
  }

  if (enrolment) {
    return (
      <Link href={lessonHref} className={buttonVariants({ size: 'lg' })}>
        {t('continue')}
      </Link>
    )
  }

  if (course.access === 'premium') {
    return (
      <Link href="/pricing" className={buttonVariants({ size: 'lg' })}>
        {t('subscribeToUnlock')}
      </Link>
    )
  }

  return <EnrolButton courseId={course.id} firstLessonHref={lessonHref} />
}
