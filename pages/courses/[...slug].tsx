import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { withApollo } from '@/apollo/withApollo'
import Layout from '@/components/layout'
import { useCourseBySlug } from '@/apollo/client/queries/course/useCourseByIdOrSlug'
import LessonView from '@/components/lessonView'

const CoursePage: NextPage<{}> = () => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []
  const courseSlug = slug[0]
  const { data, loading, error } = useCourseBySlug(courseSlug as string)

  const course = data?.course

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!course) return <div>Course not found</div>
  if (course && !course.lessons)
    return <div>No lessons found for this course</div>

  return (
    <Layout>
      <LessonView course={course} />
    </Layout>
  )
}

export default withApollo()(CoursePage)
