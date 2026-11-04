import { getTranslations } from 'next-intl/server'

export const SiteFooter = async () => {
  const t = await getTranslations('Metadata')

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm sm:px-6 lg:px-8">
        <p className="font-semibold">Rabble</p>
        <p>{t('description')}</p>
      </div>
    </footer>
  )
}
