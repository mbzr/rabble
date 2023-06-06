import React from 'react'
import { NextPage } from 'next'

import Layout from 'components/layout'
import EditProfileForm from '@/components/forms/editProfileForm'
import ChangePasswordForm from '@/components/forms/changePasswordForm'
import useCurrentUser from '@/apollo/client/queries/user/useCurrentUser'
import { withApollo } from '@/apollo/withApollo'
import DeleteAccountForm from '@/components/forms/deleteAccountForm'
import Tabs from '@/components/sections/accountTabs'

const AccountPage: NextPage<{}> = () => {
  const { data, loading } = useCurrentUser()

  if (loading) {
    return <div>Loading...</div>
  }

  if (data?.user) {
    return (
      <Layout>
        <div className="max-w-[500px] mx-auto p-12">
          <Tabs />

          <div className="py-12 text-center">
            <h2 className="font-bold text-4xl">My Account</h2>
            <p className="mt-2 text-md text-gray-500">
              Manage your profile, notifications and history
              settings here.
            </p>
          </div>

          <div className="space-y-8 divide-y divide-gray-200">
            <EditProfileForm user={data.user} />
            <ChangePasswordForm />
            <DeleteAccountForm />
          </div>
        </div>
      </Layout>
    )
  }

  return <div>Error!</div>
}

export default withApollo()(AccountPage)
