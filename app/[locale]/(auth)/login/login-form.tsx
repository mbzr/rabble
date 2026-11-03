'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'

export const LoginForm = () => {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
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
      setError(error.message ?? 'Something went wrong')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('signInTitle')}</h1>

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
          autoComplete="current-password"
          className="rounded border px-3 py-2"
        />
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
        {pending ? t('signingIn') : t('signIn')}
      </button>

      <p>
        {t('noAccount')}{' '}
        <Link href="/signup" className="underline">
          {t('signUpLink')}
        </Link>
      </p>
    </form>
  )
}
