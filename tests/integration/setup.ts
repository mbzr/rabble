import { sql } from 'drizzle-orm'
import { beforeAll } from 'vitest'
import { db } from '@/db'

beforeAll(async () => {
  const { rows } = await db.execute<{ tablename: string }>(
    sql`select tablename from pg_tables where schemaname = 'public'`,
  )
  if (rows.length === 0) return

  const tables = rows.map((row) => `"${row.tablename}"`).join(', ')
  await db.execute(sql.raw(`truncate table ${tables} restart identity cascade`))
})
