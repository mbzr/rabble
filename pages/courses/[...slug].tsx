import React from 'react'
import { NextPage } from 'next'
import Vimeo from '@u-wave/react-vimeo'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { withApollo } from '@/apollo/withApollo'
import Layout from '@/components/layout'
import { useCourseBySlug } from '@/apollo/client/queries/course/useCourseByIdOrSlug'

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`

const Button = styled.button`
  width: 100%;
  background: ${(props: any) => (props.active ? '#eee' : '#fff')};
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: #eee;
  }
`

const LessonView: React.FC<{ course: any }> = ({ course }) => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []
  const lessonSlug = slug[1]
  const publishedLessons = course.lessons.filter(
    (lesson: any) => lesson.isPublished
  )
  const lessonIndex = publishedLessons.findIndex(
    (lesson: any) => lesson.slug === lessonSlug
  )
  const initialLesson = publishedLessons[lessonIndex] || publishedLessons[0]
  const [currentLesson, setCurrentLesson] = React.useState(initialLesson)
  const videoId = currentLesson?.video.id

  React.useEffect(() => {
    router.push(`/courses/${course.slug}/${currentLesson?.slug}`, undefined, {
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson, course])

  return (
    <GridDiv>
      <div>
        <Vimeo video={videoId} autoplay={true} width={600} height={400} />
      </div>
      <div>
        {publishedLessons.map((lesson: any) => (
          <div key={lesson.id}>
            <Button
              active={lesson.id === currentLesson.id}
              onClick={() => setCurrentLesson(lesson)}
            >
              {lesson.name}
            </Button>
          </div>
        ))}
      </div>
    </GridDiv>
  )
}

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
