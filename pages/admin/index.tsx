import React from 'react'
import { NextPage } from 'next'

import CreateCourseForm from '@/components/forms/createCourseForm'
import { withApollo } from '@/apollo/withApollo'

const AdminPage: NextPage<{}> = ({}) => {
  return (
    <div>
      <h1>Welcome to the admin page</h1>
      <CreateCourseForm />
    </div>
  )
}

export default withApollo()(AdminPage)
