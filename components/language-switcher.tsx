'use client'

import { useLocale, useTranslations } from 'next-intl'
import { buttonVariants } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('Header')
  const target = locale === 'ar' ? 'en' : 'ar'

  return (
    <Link
      href={pathname}
      locale={target}
      lang={target}
      hrefLang={target}
      className={buttonVariants({ variant: 'ghost' })}
    >
      {t('switchLanguage')}
    </Link>
  )
}
