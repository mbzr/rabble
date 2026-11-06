import { BookOpenIcon, SearchXIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { catalogFiltersSchema } from '@/lib/schemas/course'
import {
  listCatalogCategories,
  listPublishedCourses,
} from '@/lib/server/courses'
import { CatalogFiltersForm } from './catalog-filters-form'
import { CategoryChips } from './category-chips'
import { CourseCard } from '@/components/course/course-card'

type CatalogPageProps = PageProps<'/[locale]/courses'>

const CatalogSkeleton = () => (
  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
    {[1, 2, 3].map((item) => (
      <li key={item}>
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      </li>
    ))}
  </ul>
)

const CatalogContent = async ({
  searchParams,
}: Pick<CatalogPageProps, 'searchParams'>) => {
  const filters = catalogFiltersSchema.parse(await searchParams)
  const [courses, categories, t] = await Promise.all([
    listPublishedCourses(filters),
    listCatalogCategories(),
    getTranslations('Catalog'),
  ])
  const isFiltered = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <CategoryChips categories={categories} filters={filters} />
      <CatalogFiltersForm filters={filters} />
      {courses.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {isFiltered ? <SearchXIcon /> : <BookOpenIcon />}
            </EmptyMedia>
            <EmptyTitle>
              {isFiltered ? t('noMatchesTitle') : t('emptyTitle')}
            </EmptyTitle>
            <EmptyDescription>
              {isFiltered ? t('noMatchesBody') : t('emptyBody')}
            </EmptyDescription>
          </EmptyHeader>
          {isFiltered ? (
            <EmptyContent>
              <Link
                href="/courses"
                className={buttonVariants({ variant: 'outline' })}
              >
                {t('clearFilters')}
              </Link>
            </EmptyContent>
          ) : null}
        </Empty>
      )}
    </div>
  )
}

const CatalogPage = async ({ searchParams }: CatalogPageProps) => {
  const t = await getTranslations('Catalog')

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default CatalogPage
