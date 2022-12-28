import React from 'react'
import Link from 'next/link'

import { withApollo } from '@/apollo/withApollo'
import useCourse from '@/lib/hooks/useCourse'
import EditCourseForm from '@/components/forms/editCourseForm'

const AdminEditCoursePage = () => {
  const { course, loading, error } = useCourse()

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div>
      <EditCourseForm course={course} />

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
