import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { z } from 'zod'
import { Link } from '@/i18n/navigation'
import { ResetPasswordForm } from './reset-password-form'

type ResetPasswordPageProps = PageProps<'/[locale]/reset-password'>

const searchParamsSchema = z.object({
  token: z.string().min(1).optional(),
  error: z.string().optional(),
})

const ResetPasswordContent = async ({
  searchParams,
}: Pick<ResetPasswordPageProps, 'searchParams'>) => {
  const [params, t] = await Promise.all([searchParams, getTranslations('Auth')])
  const parsed = searchParamsSchema.safeParse(params)
  const token =
    parsed.success && !parsed.data.error ? parsed.data.token : undefined

  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{t('resetLinkInvalidTitle')}</h1>
        <p className="text-muted-foreground">{t('resetLinkInvalidBody')}</p>
        <Link
          href="/forgot-password"
          className="text-primary underline underline-offset-4"
        >
          {t('requestNewLink')}
        </Link>
      </div>
    )
  }

  return <ResetPasswordForm token={token} />
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => (
  <Suspense fallback={null}>
    <ResetPasswordContent searchParams={searchParams} />
  </Suspense>
)

export default ResetPasswordPage
