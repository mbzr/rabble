import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { z } from 'zod'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'

type VerifyEmailPageProps = PageProps<'/[locale]/verify-email'>

const searchParamsSchema = z.object({ error: z.string().optional() })

const VerifyEmailStatus = async ({
  searchParams,
}: Pick<VerifyEmailPageProps, 'searchParams'>) => {
  const [params, currentUser, t] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getTranslations('Auth'),
  ])
  const { error } = searchParamsSchema.parse(params)

  if (error) {
    return (
      <>
        <h1 className="text-2xl font-semibold">{t('linkExpiredTitle')}</h1>
        <p>{t('linkExpiredBody')}</p>
        <Link href="/login" className="underline">
          {t('goToLogin')}
        </Link>
      </>
    )
  }

  if (currentUser?.emailVerified) {
    return (
      <>
        <h1 className="text-2xl font-semibold">{t('emailConfirmedTitle')}</h1>
        <p>{t('emailConfirmedBody')}</p>
        <Link href="/" className="underline">
          {t('goHome')}
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">{t('checkEmailTitle')}</h1>
      <p>{t('checkEmailBody')}</p>
    </>
  )
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => (
  <main className="flex max-w-prose flex-col gap-4 p-8">
    <Suspense fallback={null}>
      <VerifyEmailStatus searchParams={searchParams} />
    </Suspense>
  </main>
)

export default VerifyEmailPage
