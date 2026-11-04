'use client'

import { useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'

export const SignOutButton = ({ label }: { label: string }) => {
  const router = useRouter()

  return (
    <button
      type="button"
      className="underline"
      onClick={async () => {
        await authClient.signOut()
        router.refresh()
      }}
    >
      {label}
    </button>
  )
}
