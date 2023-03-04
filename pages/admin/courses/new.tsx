import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import { withApollo } from '@/apollo/withApollo'
import CreateCourseForm from '@/components/forms/createCourseForm'

const AdminCreateCoursePage: NextPage<{}> = () => {
  return (
    <Layout>
      <CreateCourseForm />
    </Layout>
  )
}

export default withApollo()(AdminCreateCoursePage)
