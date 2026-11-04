'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface ResetPasswordFormProps {
  token: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const t = useTranslations('Auth')
  const tErrors = useTranslations('Errors')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const { error } = await authClient.resetPassword({
      newPassword: String(form.get('password')),
      token,
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
        <h1 className="text-3xl font-semibold">{t('passwordUpdatedTitle')}</h1>
        <p className="text-muted-foreground">{t('passwordUpdatedBody')}</p>
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          {t('goToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t('resetPasswordTitle')}</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">{t('newPassword')}</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            aria-describedby="password-hint"
          />
          <FieldDescription id="password-hint">
            {t('passwordHint')}
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full"
      >
        {pending ? t('savingPassword') : t('savePassword')}
      </Button>
    </form>
  )
}
