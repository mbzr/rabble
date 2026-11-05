import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { CatalogFilters, CourseCategory } from '@/lib/schemas/course'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  categories: CourseCategory[]
  filters: CatalogFilters
}

const catalogHref = (filters: CatalogFilters, category?: CourseCategory) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries({ ...filters, category })) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/courses?${query}` : '/courses'
}

export const CategoryChips = async ({
  categories,
  filters,
}: CategoryChipsProps) => {
  const t = await getTranslations('Catalog')
  const chips = [
    { value: undefined, label: t('allCategories') },
    ...categories.map((category) => ({
      value: category,
      label: t(`categories.${category}`),
    })),
  ]

  return (
    <nav aria-label={t('categoryNav')}>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isCurrent = filters.category === chip.value
          return (
            <li key={chip.value ?? 'all'}>
              <Link
                href={catalogHref(filters, chip.value)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'focus-visible:ring-ring inline-flex h-8 items-center rounded-full border px-3 text-sm transition-colors duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
                )}
              >
                {chip.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
