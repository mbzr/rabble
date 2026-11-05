import { GraduationCapIcon } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
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
import { Link, redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'

const MyLearning = async () => {
  const [currentUser, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations('MyLearning'),
  ])

  if (!currentUser) return redirect({ href: '/login', locale })

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GraduationCapIcon />
          </EmptyMedia>
          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyBody')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/courses" className={buttonVariants()}>
            {t('browseCourses')}
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}

const MyLearningPage = () => (
  <Suspense fallback={null}>
    <MyLearning />
  </Suspense>
)

export default MyLearningPage
