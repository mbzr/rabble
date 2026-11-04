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
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{t('linkExpiredTitle')}</h1>
        <p className="text-muted-foreground">{t('linkExpiredBody')}</p>
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          {t('goToLogin')}
        </Link>
      </div>
    )
  }

  if (currentUser?.emailVerified) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{t('emailConfirmedTitle')}</h1>
        <p className="text-muted-foreground">{t('emailConfirmedBody')}</p>
        <Link href="/" className="text-primary underline underline-offset-4">
          {t('goHome')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t('checkEmailTitle')}</h1>
      <p className="text-muted-foreground">{t('checkEmailBody')}</p>
    </div>
  )
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => (
  <Suspense fallback={null}>
    <VerifyEmailStatus searchParams={searchParams} />
  </Suspense>
)

export default VerifyEmailPage
