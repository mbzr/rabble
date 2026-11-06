import { BookOpenIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { CourseCard } from '@/components/course/course-card'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { listCatalogCategories, listRecentCourses } from '@/lib/server/courses'

const HomePage = async () => {
  const [categories, courses, t, tCatalog] = await Promise.all([
    listCatalogCategories(),
    listRecentCourses(),
    getTranslations('Home'),
    getTranslations('Catalog'),
  ])

  return (
    <div className="flex flex-col gap-16">
      <section className="flex max-w-prose flex-col items-start gap-4">
        <h1 className="text-4xl font-semibold lg:text-5xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('intro')}</p>
        <Link href="/courses" className={buttonVariants({ size: 'lg' })}>
          {t('browseCourses')}
        </Link>
      </section>

      {categories.length > 0 ? (
        <section
          aria-labelledby="browse-by-category"
          className="flex flex-col gap-6"
        >
          <h2 id="browse-by-category" className="text-xl font-semibold">
            {t('byCategory')}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={{ pathname: '/courses', query: { category } }}
                  className="hover:bg-accent focus-visible:ring-ring flex h-full items-center rounded-xl border p-4 text-sm font-medium transition-colors duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {tCatalog(`categories.${category}`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="recently-added" className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="recently-added" className="text-xl font-semibold">
            {t('recentlyAdded')}
          </h2>
          {courses.length > 0 ? (
            <Link
              href="/courses"
              className="text-primary text-sm underline underline-offset-4"
            >
              {t('seeAll')}
            </Link>
          ) : null}
        </div>
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
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>{tCatalog('emptyTitle')}</EmptyTitle>
              <EmptyDescription>{tCatalog('emptyBody')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </div>
  )
}

export default HomePage
