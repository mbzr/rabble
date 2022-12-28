import { gql, useMutation } from '@apollo/client'

import { CreateCourseInput, CourseInfoType } from '@/lib/types/course'
import { courseInfoFragment } from '@/apollo/client/fragments/course'

interface CreateCourseResponse {
  course: CourseInfoType
}

interface CreateCourseVariables {
  input: CreateCourseInput
}

export const createCourseMutation = gql`
  mutation createCourse($input: CreateCourseInput!) {
    course: createCourse(input: $input) {
      ...courseInfo
    }
  }
  ${courseInfoFragment}
`

export default function useCreateCourseMutation() {
  return useMutation<CreateCourseResponse, CreateCourseVariables>(
    createCourseMutation
  )
}
