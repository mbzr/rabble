import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import { withApollo } from '../../apollo/withApollo'

const AdminPage: NextPage<{}> = () => {
  return (
    <div>
      <h1>Welcome to the admin page</h1>
      <Link href="/admin/courses/new">New Course</Link>
    </div>
  )
}

export default withApollo()(AdminPage)
