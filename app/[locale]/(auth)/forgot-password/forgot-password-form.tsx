'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'

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
      <div role="status" className="flex max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t('resetSentTitle')}</h1>
        <p>{t('resetSentBody')}</p>
        <Link href="/login" className="underline">
          {t('backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('forgotPasswordTitle')}</h1>
      <p>{t('forgotPasswordBody')}</p>

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
        {pending ? t('sendingResetLink') : t('sendResetLink')}
      </button>

      <Link href="/login" className="underline">
        {t('backToLogin')}
      </Link>
    </form>
  )
}
