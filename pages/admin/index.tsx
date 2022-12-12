import React from 'react'
import { NextPage } from 'next'

import { withApollo } from '@/apollo/withApollo'
import Link from 'next/link'

const AdminPage: NextPage<{}> = ({}) => {
  return (
    <div>
      <h1>Welcome to the admin page</h1>
      <Link href="/admin/course/new">New Course</Link>
    </div>
  )
}

export default withApollo()(AdminPage)
