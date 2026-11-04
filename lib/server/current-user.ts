import 'server-only'
import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from '@/lib/auth'
import { ForbiddenError, UnauthenticatedError } from './errors'

export type Role = 'learner' | 'instructor' | 'admin'

export interface CurrentUser {
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

export const requireUser = async (): Promise<CurrentUser> => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedError()
  return user
}

export const requireRole = async (...allowed: Role[]): Promise<CurrentUser> => {
  const user = await requireUser()
  if (!allowed.includes(user.role)) throw new ForbiddenError()
  return user
}
