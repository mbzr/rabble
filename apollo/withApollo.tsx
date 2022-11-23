import React from 'react'
import { NextPage, NextPageContext } from 'next'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
  NormalizedCacheObject,
} from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'

import { schema } from '@/apollo/schema'
import { getServerSession } from '@/lib/auth/session'

interface NextPageContextProps extends NextPageContext {
  user: any
  apolloClient?: ApolloClient<NormalizedCacheObject>
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

function createApolloClient(
  initialState: NormalizedCacheObject,
  ctx: NextPageContextProps
) {
  let apolloLink = null

  if (typeof window === 'undefined') {
    apolloLink = new SchemaLink({
      schema,
      context: {
        user: ctx.user || null,
      },
    })
  } else {
    apolloLink = createUploadLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    })
  }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    ssrForceFetchDelay: 100,
    link: from([errorLink, apolloLink]),
    cache: new InMemoryCache().restore(initialState),
  })
}

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null

const initApolloClient = (
  initialState: NormalizedCacheObject,
  ctx: NextPageContextProps
) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx)
  }

  return globalApolloClient
}

export const withApollo =
  ({ ssr = true } = {}) =>
  (PageComponent: NextPage) => {
    const WithApollo = (props: any) => {
      const { apolloClient, apolloState, ...pageProps } = props

      let client
      if (apolloClient) {
        // runs on: getDataFromTree & next.js ssr
        // console.log('ssr')
        client = apolloClient
      } else {
        // runs on: next.js csr
        // client = initApolloClient(apolloState, undefined);
        client = initApolloClient(
          apolloState,
          {} as unknown as NextPageContextProps
        )
      }

      return (
        <ApolloProvider client={client}>
          <PageComponent {...pageProps} />
        </ApolloProvider>
      )
    }

    // Set the correct displayName in development
    if (process.env.NODE_ENV !== 'production') {
      const displayName =
        PageComponent.displayName || PageComponent.name || 'Component'
      WithApollo.displayName = `withApollo(${displayName})`
    }
    if (ssr || PageComponent.getInitialProps) {
      WithApollo.getInitialProps = async (ctx: NextPageContextProps) => {
        const { AppTree } = ctx

        // this will run on server side only
        const session = await getServerSession(ctx)

        // Initialize ApolloClient, add it to the ctx object so
        // we can use it in `PageComponent.getInitialProps`.
        const apolloClient = (ctx.apolloClient = initApolloClient(
          null as unknown as NormalizedCacheObject,
          {
            ...ctx,
            user: session ? session.user : null,
          }
        ))

        // Run wrapped getInitialProps methods
        let pageProps = {}
        if (PageComponent.getInitialProps) {
          pageProps = await PageComponent.getInitialProps(ctx)
        }

        // Only on the server:
        if (typeof window === 'undefined') {
          // When redirecting, the response is finished.
          // No point in continuing to render
          if (ctx.res && ctx.res.writableEnded) {
            return pageProps
          }

          // Only if ssr is enabled
          if (ssr) {
            try {
              // Run all GraphQL queries
              const { getDataFromTree } = await import(
                '@apollo/client/react/ssr'
              )
              await getDataFromTree(
                <AppTree
                  pageProps={{
                    ...pageProps,
                    apolloClient,
                  }}
                />
              )
            } catch (error) {
              // Prevent Apollo Client GraphQL errors from crashing SSR.
              // Handle them in components via the data.error prop:
              // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
              console.error('Error while running `getDataFromTree`', error)
            }

            // getDataFromTree does not call componentWillUnmount
            // head side effect therefore need to be cleared manually
            // Head.rewind()
          }
        }

        // Extract query data from the Apollo store
        const apolloState = apolloClient.cache.extract()

        return {
          ...pageProps,
          apolloState,
        }
      }
    }

    return WithApollo
  }
