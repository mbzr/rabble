'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'

export const SignupForm = () => {
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
    const { error } = await authClient.signUp.email({
      name: String(form.get('name')),
      email: String(form.get('email')),
      password: String(form.get('password')),
    })

    setPending(false)
    if (error) {
      setError(tErrors(authErrorKey(error.code)))
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t('signUpTitle')}</h1>

        <label className="flex flex-col gap-1">
          {t('name')}
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          {t('email')}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          {t('password')}
          <input
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            aria-describedby="password-hint"
            className="rounded border px-3 py-2"
          />
          <span id="password-hint" className="text-sm text-gray-600">
            {t('passwordHint')}
          </span>
        </label>

        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? t('signingUp') : t('signUp')}
        </button>
      </form>
      <p>
        {t('haveAccount')}{' '}
        <Link href="/login" className="underline">
          {t('signInLink')}
        </Link>
      </p>
    </>
  )
}
