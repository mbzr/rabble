import 'server-only'
import { GraphQLError } from 'graphql'
import { createSchema, createYoga, maskError } from 'graphql-yoga'
import { toErrorCode } from '@/lib/server/errors'
import { resolvers } from './resolvers'
import { typeDefs } from './type-defs'

export const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
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
})
