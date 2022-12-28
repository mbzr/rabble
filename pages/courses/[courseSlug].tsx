import React from 'react'
import { NextPage } from 'next'
import Image from 'next/image'

import { withApollo } from '@/apollo/withApollo'
import useCourse from '@/lib/hooks/useCourse'

const CoursePage: NextPage<{}> = () => {
  const { course, error, loading } = useCourse()

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div>
      <Image
        priority
        src={course.coverPhoto || '/default_profile_photo.png'}
        alt="profile picture"
        width={150}
        height={150}
      />
      <h1>{course.name}</h1>
      <p>{course.description}</p>
    </div>
  )
}

export default withApollo()(CoursePage)
