import { gql, useMutation } from '@apollo/client'

import { CreateCourseInput, CourseInfoType } from '@/lib/types/course'
import { courseInfoFragment } from '@/apollo/client/fragments/course'

interface CreateCourseResponse extends CourseInfoType {}

interface CreateCourseVariables {
  input: CreateCourseInput
}

export const createCourseMutation = gql`
  mutation createCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
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
