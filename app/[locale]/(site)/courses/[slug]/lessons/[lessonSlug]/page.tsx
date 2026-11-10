import { getTranslations } from 'next-intl/server'

const LessonPage = async () => {
  const t = await getTranslations('Lesson')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center rounded-lg p-4 text-center lg:col-span-2">
          <p>{t('placeholder')}</p>
        </div>
        <aside aria-labelledby="lesson-list-heading">
          <h2 id="lesson-list-heading" className="text-xl font-semibold">
            {t('lessons')}
          </h2>
        </aside>
      </div>
    </div>
  )
}

export default LessonPage
