'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const ForgotPasswordForm = () => {
  const t = useTranslations('Auth')
  const tErrors = useTranslations('Errors')
  const locale = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const { error } = await authClient.requestPasswordReset({
      email: String(form.get('email')),
      redirectTo: `/${locale}/reset-password`,
    })

    setPending(false)
    if (error) {
      setError(tErrors(authErrorKey(error.code)))
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{t('resetSentTitle')}</h1>
        <p className="text-muted-foreground">{t('resetSentBody')}</p>
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          {t('backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t('forgotPasswordTitle')}</h1>
      <p className="text-muted-foreground">{t('forgotPasswordBody')}</p>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full"
      >
        {pending ? t('sendingResetLink') : t('sendResetLink')}
      </Button>

      <p className="text-center text-sm">
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  )
}
