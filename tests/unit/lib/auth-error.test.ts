import { expect, test } from 'vitest'
import { authErrorKey } from '@/lib/auth-error'

test('unknown auth error codes fall back to the generic message', () => {
  expect(authErrorKey('SOMETHING_NEW')).toBe('generic')
})
