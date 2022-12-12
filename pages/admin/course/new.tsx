import React from 'react'
import { NextPage } from 'next'

import CreateCourseForm from '@/components/forms/createCourseForm'
import { withApollo } from '@/apollo/withApollo'

const AdminPage: NextPage<{}> = ({}) => {
  return (
    <div>
      <h1>Create a course</h1>
      <CreateCourseForm />
    </div>
  )
}

export default withApollo()(AdminPage)
