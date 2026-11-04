import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

export const setup = async () => {
  loadEnvConfig(process.cwd())
  const { env } = await import('@/env')
  const url = env.DATABASE_URL ?? ''

  if (!url.endsWith('_test')) {
    throw new Error('DATABASE_URL is not a test database')
  }

  const pool = new Pool({ connectionString: url })
  await migrate(drizzle({ client: pool }), { migrationsFolder: './drizzle' })
  await pool.end()
}
