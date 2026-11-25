import 'server-only'
import { GraphQLError } from 'graphql'
import { createSchema, createYoga, maskError } from 'graphql-yoga'
import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention'
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations'
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'
import { toErrorCode } from '@/lib/server/errors'
import { resolvers } from './resolvers'
import { typeDefs } from './type-defs'
import persistedDocuments from './generated/client/persisted-documents.json'
import { env } from '@/env'

// every operation the studio ships with, by its SHA-256 hash
const documents: Record<string, string> = persistedDocuments

interface GraphQLServerOptions {
  isProduction: boolean
}

export const createGraphQLServer = ({ isProduction }: GraphQLServerOptions) => {
  return createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: '/api/graphql',
    graphiql: !isProduction,
    fetchAPI: { Response },
    maskedErrors: {
      // our expected errors keep their code. anything else becomes "unexpected error"
      maskError: (error, message, isDev) => {
        const original =
          error instanceof Error && error.cause !== undefined
            ? error.cause
            : error
        const code = toErrorCode(original)
        if (code && original instanceof Error) {
          return new GraphQLError(original.message, {
            extensions: { code: code.toUpperCase() },
          })
        }
        return maskError(error, message, isDev)
      },
    },
    plugins: [
      // GET requests need a custom header, so another site can't trigger them
      useCSRFPrevention(),
      // Production runs only the operations in the manifest. Development allows any query
      usePersistedOperations({
        getPersistedOperation: (hash) => documents[hash] ?? null,
        allowArbitraryOperations: !isProduction,
      }),
      ...(isProduction ? [useDisableIntrospection()] : []),
    ],
  })
}

export const yoga = createGraphQLServer({
  isProduction: env.NODE_ENV === 'production',
})
