import { gql, useMutation } from '@apollo/client'

import { EditCourseInput, CourseInfoType } from '@/lib/types/course'
import { courseInfoFragment } from '@/apollo/client/fragments/course'

interface EditCourseResponse {
  course: CourseInfoType
}

interface EditCourseVariables {
  input: EditCourseInput
}

export const editCourseMutation = gql`
  mutation editCourse($input: EditCourseInput!) {
    course: editCourse(input: $input) {
      ...courseInfo
    }
  }
  ${courseInfoFragment}
`

export default function useEditCourseMutation() {
  return useMutation<EditCourseResponse, EditCourseVariables>(
    editCourseMutation
  )
}
