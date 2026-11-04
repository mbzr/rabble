'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { authErrorKey } from '@/lib/auth-error'

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
      <div role="status" className="flex max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t('passwordUpdatedTitle')}</h1>
        <p>{t('passwordUpdatedBody')}</p>
        <Link href="/login" className="underline">
          {t('goToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('resetPasswordTitle')}</h1>

      <label className="flex flex-col gap-1">
        {t('newPassword')}
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
        {pending ? t('savingPassword') : t('savePassword')}
      </button>
    </form>
  )
}
