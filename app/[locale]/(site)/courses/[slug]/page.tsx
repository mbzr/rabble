import { getTranslations } from 'next-intl/server'

const CoursePage = async () => {
  const t = await getTranslations('Course')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('placeholder')}</p>
    </div>
  )
}

export default CoursePage
