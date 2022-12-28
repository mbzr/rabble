import { gql, useMutation } from '@apollo/client'

import { CreateLessonInput, LessonInfoType } from '@/lib/types/lesson'
import { lessonInfoFragment } from '@/apollo/client/fragments/lesson'

interface CreateLessonResponse {
  lesson: LessonInfoType
}

interface CreateLessonVariables {
  input: CreateLessonInput
}

export const createLessonMutation = gql`
  mutation createLesson($input: CreateLessonInput!) {
    lesson: createLesson(input: $input) {
      ...lessonInfo
    }
  }
  ${lessonInfoFragment}
`

export default function useCreateLessonMutation() {
  return useMutation<CreateLessonResponse, CreateLessonVariables>(
    createLessonMutation
  )
}
