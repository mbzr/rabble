import persistedDocuments from '@/lib/graphql/generated/client/persisted-documents.json'
import { createGraphQLServer } from '@/lib/graphql/yoga'
import { signInAs, signOut } from '@/tests/auth'
import { createUser } from '@/tests/factories'
import { afterEach, describe, expect, test } from 'vitest'

// introspection, debug output and any query were open in production
const production = createGraphQLServer({ isProduction: true })

const post = async (body: object) => {
  const response = await production.fetch('http://localhost/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json()
}

const studioCoursesHash = Object.entries(persistedDocuments).find(
  ([, document]) => document.includes('StudioCourses'),
)?.[0]

describe('the GraphQL endpoint in production', () => {
  afterEach(() => signOut())

  test('rejects a query that is not one of ours', async () => {
    const result = await post({ query: '{ studioCourses { id } }' })

    expect(result.data).toBeUndefined()
    expect(result.errors[0].message).toBe('PersistedQueryOnly')
  })

  test('rejects introspection', async () => {
    const result = await post({ query: '{ __schema { types { name } } }' })

    expect(result.data).toBeUndefined()
    expect(result.errors).toHaveLength(1)
  })

  test('runs a known operation by its hash', async () => {
    await signInAs(await createUser({ role: 'instructor' }))

    const result = await post({
      extensions: {
        persistedQuery: { version: 1, sha256Hash: studioCoursesHash },
      },
    })

    expect(result).toEqual({ data: { studioCourses: [] } })
  })

  test('rejects a GET without the CSRF header', async () => {
    const response = await production.fetch(
      'http://localhost/api/graphql?query=%7B__typename%7D',
    )

    expect(response.status).toBe(403)
  })
})
