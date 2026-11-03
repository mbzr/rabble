import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { admin, haveIBeenPwned } from 'better-auth/plugins'
import { db } from '@/db'
import { env } from '@/env'
import { ac, roles } from './auth-permissions'
import * as authSchema from '@/db/schema/auth'

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
  advanced: { database: { generateId: 'uuid' } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
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
    },
  },
  plugins: [
    admin({ ac, roles, defaultRole: 'learner' }),
    haveIBeenPwned(),
    nextCookies(), // must stay last
  ],
})
