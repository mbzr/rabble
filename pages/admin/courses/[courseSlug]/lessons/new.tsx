import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import { withApollo } from '@/apollo/withApollo'
import useCourse from '@/lib/hooks/useCourse'
import CreateLessonForm from '@/components/forms/createLessonForm'

const AdminCreateLessonPage: NextPage<{}> = () => {
  const { loading: courseLoading, course, error } = useCourse()

  if (courseLoading) return <div>Loading...</div>
  if (!course) return <div>Invalid page</div>
  if (error) return <div>error</div>

  return (
    <Layout>
      <CreateLessonForm course={course} />
    </Layout>
  )
}

export default withApollo()(AdminCreateLessonPage)
