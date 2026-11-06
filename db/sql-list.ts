import { sql } from 'drizzle-orm'

export const sqlList = (values: readonly string[]) =>
  sql.raw(values.map((value) => `'${value}'`).join(', '))
