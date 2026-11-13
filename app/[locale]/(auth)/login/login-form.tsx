'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { withNext } from '@/lib/safe-next'

interface LoginPageProps {
  next: string | null
}

export const LoginForm = ({ next }: LoginPageProps) => {
  const t = useTranslations('Auth')
  const tErrors = useTranslations('Errors')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const { error } = await authClient.signIn.email({
      email: String(form.get('email')),
      password: String(form.get('password')),
    })

    setPending(false)
    if (error) {
      setError(tErrors(authErrorKey(error.code)))
      return
    }
    router.push(next || '/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t('signInTitle')}</h1>

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
        <Field>
          <div className="flex items-center justify-between gap-4">
            <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-primary text-xs underline underline-offset-4"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full"
      >
        {pending ? t('signingIn') : t('signIn')}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t('noAccount')}{' '}
        <Link href={withNext('/signup', next)} className="underline">
          {t('signUpLink')}
        </Link>
      </p>
    </form>
  )
}
