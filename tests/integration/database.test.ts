import { expect, test } from 'vitest'
import { db } from '@/db'
import { user } from '@/db/schema/auth'

test('the test database is migrated and empty', async () => {
  expect(await db.select().from(user)).toEqual([])
})
