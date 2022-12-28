import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { withApollo } from '@/apollo/withApollo'
import useCourse from '@/lib/hooks/useCourse'

const AdminEditCoursePage = () => {
  const { course, loading, error } = useCourse()

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div>
      <h1>Edit Course</h1>

      <Image
        src={course.coverPhoto || '/default_profile_photo.png'}
        alt={course.name}
        width={150}
        height={150}
        priority
      />
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <p>{course.level}</p>
      <hr />
      <h2>Lessons</h2>
      <div>No Lessons Yet</div>
      <Link
        style={{ color: 'blue', textDecoration: 'underline' }}
        href={`/admin/courses/${course.slug}/lessons/new`}
      >
        Create lessons
      </Link>
    </div>
  )
}

export default withApollo()(AdminEditCoursePage)
