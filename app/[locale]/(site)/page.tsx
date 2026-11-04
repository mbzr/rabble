import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { SignOutButton } from '@/components/sign-out-button'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'

const CurrentUserStatus = async () => {
  const [currentUser, t] = await Promise.all([
    getCurrentUser(),
    getTranslations('Auth'),
  ])

  if (!currentUser) {
    return (
      <div className="flex gap-4">
        <Link href="/login" className="underline">
          {t('signInLink')}
        </Link>
        <Link href="/signup" className="underline">
          {t('signUpLink')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <p>{t('signedInAs', { name: currentUser.name })}</p>
      <SignOutButton label={t('signOut')} />
    </div>
  )
}

const HomePage = () => {
  const t = useTranslations('Home')

  return (
    <main className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <Suspense fallback={null}>
        <CurrentUserStatus />
      </Suspense>
    </main>
  )
}

export default HomePage
