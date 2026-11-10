import { attachDatabasePool } from '@vercel/functions'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '@/env'

const globalForDb = globalThis as unknown as { pool?: Pool }

const pool =
  globalForDb.pool ?? new Pool({ connectionString: env.DATABASE_URL })

if (env.NODE_ENV !== 'production') globalForDb.pool = pool

// closes idle connections before Vercel suspends the function,
// does nothing outside Vercel Functions
attachDatabasePool(pool)

export const db = drizzle({ client: pool })
