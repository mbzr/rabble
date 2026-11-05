import { ShieldIcon } from 'lucide-react'
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

const Admin = async () => {
  const [currentUser, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations('Admin'),
  ])

  if (!currentUser) return redirect({ href: '/login', locale })
  if (currentUser.role !== 'admin') notFound()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldIcon />
          </EmptyMedia>
          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyBody')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

const AdminPage = () => (
  <Suspense fallback={null}>
    <Admin />
  </Suspense>
)

export default AdminPage
