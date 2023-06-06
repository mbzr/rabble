import React from 'react'

import Layout from '@/components/layout'
import { withApollo } from '@/apollo/withApollo'

const CoursesPage = () => {
  return (
    <Layout>
      <div>Courses page</div>
    </Layout>
  )
}

export default withApollo()(CoursesPage)
