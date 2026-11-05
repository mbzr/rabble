import { BookOpenIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const CatalogPage = async () => {
  const t = await getTranslations('Catalog')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenIcon />
          </EmptyMedia>
          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyBody')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default CatalogPage
