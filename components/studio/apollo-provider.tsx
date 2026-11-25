'use client'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { ApolloProvider } from '@apollo/client/react'
import { type ReactNode, useState } from 'react'

const createClient = () =>
  new ApolloClient({
    link: new PersistedQueryLink({
      // GraphQL Codegen's documented setup: each generated document carries its hash
      generateHash: (document) =>
        (document as unknown as { __meta__: { hash: string } }).__meta__.hash,
    }).concat(new HttpLink({ uri: '/api/graphql' })),
    cache: new InMemoryCache(),
  })

interface StudioApolloProviderProps {
  children: ReactNode
}

export const StudioApolloProvider = ({
  children,
}: StudioApolloProviderProps) => {
  // one client per browser tab, kept across renders
  const [client] = useState(createClient)

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
