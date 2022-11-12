import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import Layout from 'components/layout'
import EditProfileForm from '@/components/forms/editProfileForm'
import ChangePasswordForm from '@/components/forms/changePasswordForm'
import useCurrentUser from '@/apollo/client/queries/user/useCurrentUser'
import { withApollo } from '@/apollo/withApollo'

const AccountPage: NextPage<{}> = () => {
  const { data, loading } = useCurrentUser()

  if (loading) {
    return <div>Loading...</div>
  }

  if (data?.user) {
    return (
      <Layout>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 0' }}>
          <Link href="/account/notifications">Notifications</Link>
          <EditProfileForm user={data.user} />
          <ChangePasswordForm />
        </div>
      </Layout>
    )
  }

  return <div>Error!</div>
}

export default withApollo()(AccountPage)
