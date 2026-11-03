import 'server-only'
import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from '@/lib/auth'
import { ForbiddenError, UnauthenticatedError } from './errors'

export type Role = 'learner' | 'instructor' | 'admin'

export type CurrentUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: Role
  locale: 'en' | 'ar'
  isDemo: boolean
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const { user } = session
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    role: (user.role ?? 'learner') as Role,
    locale: user.locale === 'ar' ? 'ar' : 'en',
    isDemo: user.isDemo ?? false,
  }
})

export async function requireUser(): Promise<CurrentUser> {
  const viewer = await getCurrentUser()
  if (!viewer) throw new UnauthenticatedError()
  return viewer
}

export async function requireRole(...allowed: Role[]): Promise<CurrentUser> {
  const viewer = await requireUser()
  if (!allowed.includes(viewer.role)) throw new ForbiddenError()
  return viewer
}
