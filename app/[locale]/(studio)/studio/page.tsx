import { ClapperboardIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClapperboardIcon />
          </EmptyMedia>
          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyBody')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

const StudioPage = () => (
  <Suspense fallback={null}>
    <Studio />
  </Suspense>
)

export default StudioPage
