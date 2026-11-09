import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { admin, haveIBeenPwned } from 'better-auth/plugins'
import { db } from '@/db'
import { env } from '@/env'
import { ac, roles } from './auth-permissions'
import * as authSchema from '@/db/schema/auth'
import { after } from 'next/server'
import { createTranslator } from 'next-intl'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import { sendEmail } from './email'
import { logError } from './log'

const emailMessages = { en, ar }

const sendAuthEmail = (
  user: { email: string; locale?: unknown },
  kind: 'verifyEmail' | 'resetPassword',
  url: string,
) => {
  const locale = user.locale === 'ar' ? 'ar' : 'en'
  const t = createTranslator({
    locale,
    messages: emailMessages[locale],
    namespace: 'Emails',
  })

  after(() =>
    sendEmail({
      to: user.email,
      subject: t(`${kind}.subject`),
      text: t(`${kind}.body`, { url }),
    }).catch((error) => logError(error, { kind })),
  )
}

export const authOptions = {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
  advanced: { database: { generateId: 'uuid' } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) =>
      sendAuthEmail(user, 'resetPassword', url),
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) =>
      sendAuthEmail(user, 'verifyEmail', url),
  },
  user: {
    additionalFields: {
      locale: { type: ['en', 'ar'], required: false, defaultValue: 'en' },
      isDemo: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      demoExpiresAt: { type: 'date', required: false, input: false },
    },
  },
  rateLimit: {
    enabled: true,
    storage: 'database',
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 600, max: 3 },
      '/request-password-reset': { window: 600, max: 3 },
      '/send-verification-email': { window: 600, max: 3 },
    },
  },
  plugins: [
    admin({ ac, roles, defaultRole: 'learner' }),
    haveIBeenPwned(),
    nextCookies(), // must stay last
  ],
} satisfies BetterAuthOptions

export const auth = betterAuth(authOptions)
