import React from 'react'

import { withApollo } from '@/apollo/withApollo'
import useCourse from '@/lib/hooks/useCourse'
import EditCourseForm from '@/components/forms/editCourseForm'
import Layout from '@/components/layout'
import { useModal } from '@/components/modals/modalContext'
import { PrimaryButton } from '@/components/button'

const CreateButton: React.FC<{ children: React.ReactNode; course: any }> = ({
  children,
  course,
}) => {
  const { dispatch } = useModal()

  return (
    <PrimaryButton
      type="button"
      onClick={() =>
        dispatch({
          type: 'OPEN_MODAL',
          modalType: 'CREATE_LESSON_MODAL',
          modalProps: {
            courseId: course.id,
            folderUri: course.vimeoFolderUri,
          },
        })
      }
    >
      {children}
    </PrimaryButton>
  )
}

const EditLessonButton: React.FC<{
  children: React.ReactNode
  lesson: any
}> = ({ children, lesson }) => {
  const { dispatch } = useModal()

  return (
    <PrimaryButton
      type="button"
      onClick={() =>
        dispatch({
          type: 'OPEN_MODAL',
          modalType: 'EDIT_LESSON_MODAL',
          modalProps: {
            lesson: lesson,
          },
        })
      }
    >
      {children}
    </PrimaryButton>
  )
}

const AdminEditCoursePage = () => {
  const { course, loading, error } = useCourse()

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR: {error.message}</div>
  if (!course) return <div>Course not found</div>

  return (
    <Layout>
      <EditCourseForm course={course} />

      <hr />

      <h2>Lessons</h2>
      {course.lessons && course.lessons.length > 0 ? (
        <ul>
          {course.lessons.map((lesson) => (
            <li key={lesson.id}>
              <EditLessonButton lesson={lesson}>Edit</EditLessonButton>
              <button>Delete</button>
              <div>{lesson.name}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Lessons Yet</div>
      )}
      <CreateButton course={course}>Create new lesson</CreateButton>
    </Layout>
  )
}

export default withApollo()(AdminEditCoursePage)
