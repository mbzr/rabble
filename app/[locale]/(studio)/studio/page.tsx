import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Link, redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'
import { StudioCourses } from './studio-courses'
import { buttonVariants } from '@/components/ui/button'

const Studio = async () => {
  const [currentUser, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations('Studio'),
  ])

  if (!currentUser) return redirect({ href: '/login', locale })
  if (currentUser.role !== 'instructor' && currentUser.role !== 'admin') {
    notFound()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <Link href="/studio/courses/new" className={buttonVariants()}>
          New course
        </Link>
      </div>
      <StudioCourses />
    </div>
  )
}

const StudioPage = () => (
  <Suspense fallback={null}>
    <Studio />
  </Suspense>
)

export default StudioPage
