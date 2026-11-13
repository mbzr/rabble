'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
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
import { withNext } from '@/lib/safe-next'

interface SignupFormProps {
  next: string | null
}

export const SignupForm = ({ next }: SignupFormProps) => {
  const t = useTranslations('Auth')
  const tErrors = useTranslations('Errors')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const locale = useLocale()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const { error } = await authClient.signUp.email({
      name: String(form.get('name')),
      email: String(form.get('email')),
      password: String(form.get('password')),
      locale,
      callbackURL: `/${locale}/verify-email`,
    })

    setPending(false)
    if (error) {
      setError(tErrors(authErrorKey(error.code)))
      return
    }
    router.push(
      next
        ? `/${locale}/verify-email?next=${encodeURIComponent(next)}`
        : '/verify-email',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t('signUpTitle')}</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
          <Input id="name" name="name" required autoComplete="name" />
        </Field>
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
        <Field>
          <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
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
        {pending ? t('signingUp') : t('signUp')}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t('haveAccount')}{' '}
        <Link
          href={withNext('/login', next)}
          className="text-primary underline underline-offset-4"
        >
          {t('signInLink')}
        </Link>
      </p>
    </form>
  )
}
