import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { withApollo } from '@/apollo/withApollo'
import { useCourseBySlug } from '@/apollo/client/queries/course/useCourseByIdOrSlug'

const CoursePage: NextPage<{}> = ({}) => {
  const router = useRouter()
  let { slug } = router.query
  slug ??= '' as string
  const { data, error, loading } = useCourseBySlug(slug as string)

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!data || !data.course) return <div>Course not found</div>

  const course = data.course

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
