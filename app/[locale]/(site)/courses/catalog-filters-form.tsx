import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import {
  COURSE_ACCESS,
  COURSE_LANGUAGES,
  COURSE_LEVELS,
  type CatalogFilters,
} from '@/lib/schemas/course'

interface FilterSelectProps {
  name: string
  label: string
  anyLabel: string
  value: string | undefined
  options: { value: string; label: string }[]
}

const FilterSelect = ({
  name,
  label,
  anyLabel,
  value,
  options,
}: FilterSelectProps) => (
  <label className="flex flex-col gap-1 text-sm font-medium">
    {label}
    <select
      name={name}
      defaultValue={value ?? ''}
      className="border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <option value="">{anyLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

interface CatalogFiltersFormProps {
  filters: CatalogFilters
}

export const CatalogFiltersForm = async ({
  filters,
}: CatalogFiltersFormProps) => {
  const t = await getTranslations('Catalog')

  return (
    <form method="get" className="flex flex-wrap items-end gap-4">
      {filters.category ? (
        <input type="hidden" name="category" value={filters.category} />
      ) : null}
      <FilterSelect
        name="language"
        label={t('language')}
        anyLabel={t('allLanguages')}
        value={filters.language}
        options={COURSE_LANGUAGES.map((language) => ({
          value: language,
          label: t(`languages.${language}`),
        }))}
      />
      <FilterSelect
        name="level"
        label={t('level')}
        anyLabel={t('allLevels')}
        value={filters.level}
        options={COURSE_LEVELS.map((level) => ({
          value: level,
          label: t(`levels.${level}`),
        }))}
      />
      <FilterSelect
        name="access"
        label={t('access')}
        anyLabel={t('anyAccess')}
        value={filters.access}
        options={COURSE_ACCESS.map((access) => ({
          value: access,
          label: t(`accessTypes.${access}`),
        }))}
      />
      <Button type="submit" variant="outline">
        {t('applyFilters')}
      </Button>
    </form>
  )
}
