import 'server-only'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'
import { withNext } from '@/lib/safe-next'

// visitors sign in first and come back here. Learners get a 404
export const getStudioUser = async (returnPath: string) => {
  const [currentUser, locale] = await Promise.all([
    getCurrentUser(),
    getLocale(),
  ])

  if (!currentUser) {
    return redirect({ href: withNext('/login', returnPath), locale })
  }

  if (currentUser.role !== 'instructor' && currentUser.role !== 'admin') {
    notFound()
  }

  return currentUser
}
