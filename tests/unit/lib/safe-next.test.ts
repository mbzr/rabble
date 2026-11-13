import { describe, expect, test } from 'vitest'
import { safeNextPath } from '@/lib/safe-next'

const SITE = 'https://rabble.example'

describe('safeNextPath', () => {
  test('should return the next path', () => {
    expect(safeNextPath('/courses/ui-design-fundamentals', SITE)).toBe(
      '/courses/ui-design-fundamentals',
    )
    expect(safeNextPath('/courses?category=design', SITE)).toBe(
      '/courses?category=design',
    )
  })

  test.each([
    'https://evil.com',
    '//evil.com',
    'javascript:alert(1)',
    'courses',
    '',
    undefined,
  ])('rejects %j', (path) => {
    expect(safeNextPath(path as string, SITE)).toBeNull()
  })
})
