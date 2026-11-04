import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { UserMenu } from '@/components/user-menu'

export const SiteHeader = async () => {
  const t = await getTranslations('Header')

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold">
          Rabble
        </Link>
        <nav aria-label={t('mainNav')} className="text-sm font-medium">
          <Link href="/courses">{t('courses')}</Link>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
