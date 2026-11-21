import { getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import type { CourseDetail } from '@/lib/server/courses'
import { getMyEnrolmentForCourse } from '@/lib/server/enrolments'

interface CourseActionProps {
  course: CourseDetail
  // On a lesson page: continue from that lesson
  lessonSlug?: string
}

export const CourseAction = async ({
  course,
  lessonSlug,
}: CourseActionProps) => {
  const [enrolment, t] = await Promise.all([
    getMyEnrolmentForCourse(course.id),
    getTranslations('Course'),
  ])
  const lesson =
    course.lessons.find((item) => item.slug === lessonSlug) ?? course.lessons[0]
  if (!lesson) return null

  const lessonHref = `/courses/${course.slug}/lessons/${lesson.slug}`

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

  return (
    <Link href={lessonHref} className={buttonVariants({ size: 'lg' })}>
      {t('startCourse')}
    </Link>
  )
}
