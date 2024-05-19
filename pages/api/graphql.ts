import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer } from 'apollo-server-micro'
// import { ApolloServerPluginCacheControl } from 'apollo-server-core'
// import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { processRequest } from 'graphql-upload'

import { schema } from '@/apollo/schema'
import { __PROD__ } from '@/lib/constants'
import { getServerSession } from '@/lib/auth/session'

const apolloServer = new ApolloServer({
  schema,
  debug: true,
  introspection: true,
  context: async (ctx) => {
    const { user } = await getServerSession(ctx)

    // if (!user) {
    //   throw new Error('Unauthorized. You must be logged in.')
    // }

    return { user }
  },
  plugins: [
    // this plugin enables your GraphQL server to specify a cache policy at the field level,
    // either statically in your schema with the `@cacheControl` directive
    // or dynamically in your resolvers via the `info.cacheControl`
    // It also by default sets the cache-control HTTP response header
    // ApolloServerPluginCacheControl({
    //   // Cache everything for 1 min by default.
    //   defaultMaxAge: 60,
    //   // Don't send the `cache-control` response header.
    //   calculateHttpHeaders: true,
    // }),
    // responseCachePlugin({
    //   // needed to cache PRIVATE responses
    //   // @see https://www.apollographql.com/docs/apollo-server/performance/caching/#identifying-users-for-private-responses
    //   sessionId: ({ context }) => {
    //     // console.log('responseCachePlugin', context)
    //     return context.user ? context.user.id : null
    //   },
    //   // Only cache public responses
    //   shouldReadFromCache: ({ context }) => !context.user,
    //   shouldWriteToCache: ({ context }) => !context.user,
    // })
  ],
})

const startServer = apolloServer.start()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // for dev tools & studio to work
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )

  const contentType = req.headers['content-type']
  if (contentType && contentType.startsWith('multipart/form-data')) {
    req.filePayload = await processRequest(req, res)
  }

  await startServer

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
