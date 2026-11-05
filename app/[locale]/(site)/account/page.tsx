import { getLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'

const Account = async () => {
  const [currentUser, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations('Account'),
  ])

  if (!currentUser) return redirect({ href: '/login', locale })

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('placeholder')}</p>
    </div>
  )
}

const AccountPage = () => (
  <Suspense fallback={null}>
    <Account />
  </Suspense>
)

export default AccountPage
