import React from 'react'
import { NextPage } from 'next'

import { withApollo } from '@/apollo/withApollo'

const CoursePage: NextPage<{}> = ({}) => {
  return (
    <div>
      <h1>Course Page</h1>
    </div>
  )
}

export default withApollo()(CoursePage)
