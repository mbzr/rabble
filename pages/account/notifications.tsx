import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import NotificationsForm from '@/components/forms/notificationsForm'
import useCurrentUserSettings from '@/apollo/client/queries/user/useCurrentUserSettings'
import { withApollo } from '@/apollo/withApollo'
import Tabs from '@/components/sections/accountTabs'

const NotificationsPage: NextPage<{}> = () => {
  const { data, loading, error } = useCurrentUserSettings()

  if (loading) {
    return <div>Loading...</div>
  }

  if (data?.user) {
    return (
      <Layout>
        {error && (
          <pre>
            Bad:{' '}
            {error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>
            ))}
          </pre>
        )}
        <div className="max-w-[500px] mx-auto p-12">
          <Tabs />

          <NotificationsForm user={data.user} />
        </div>
      </Layout>
    )
  }

  return <div>Error!</div>
}

export default withApollo()(NotificationsPage)
