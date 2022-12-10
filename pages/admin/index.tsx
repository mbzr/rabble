import React from 'react'
import { NextPage } from 'next'

import CreateCourseForm from '@/components/forms/createCourseForm'
import { withApollo } from '@/apollo/withApollo'
import { useSession } from 'next-auth/react'

const AdminPage: NextPage<{}> = ({}) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <h1>Welcome to the admin page</h1>
        <CreateCourseForm />
      </div>
    )
  }

  return <div>Access Denied</div>
}

export default withApollo()(AdminPage)
