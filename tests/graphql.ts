import { yoga } from '@/lib/graphql/yoga'

export const executeGraphQL = async (
  query: string,
  variables?: Record<string, unknown>,
) => {
  const response = await yoga.fetch('http://localhost/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}
