import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import NotificationsForm from '@/components/forms/notificationsForm'
import useCurrentUserSettings from '@/apollo/client/queries/user/useCurrentUserSettings'
import { withApollo } from '@/apollo/withApollo'

const NotificationsPage: NextPage<{}> = () => {
  const { data, loading, error } = useCurrentUserSettings()

  if (loading) {
    return <div>Loading...</div>
  }

  if (data?.user) {
    return (
      <Layout>
        <NotificationsForm user={data.user} />
      </Layout>
    )
  }

  return <div>Error!</div>
}

export default withApollo()(NotificationsPage)
