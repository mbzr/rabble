import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'
import { StudioCourses } from './studio-courses'

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
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
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
