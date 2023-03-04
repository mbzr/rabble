import { gql, useMutation } from '@apollo/client'

import { EditLessonInput, LessonInfoType } from '@/lib/types/lesson'
import { lessonInfoFragment } from '@/apollo/client/fragments/lesson'

interface EditLessonResponse {
  lesson: LessonInfoType
}

interface EditLessonVariables {
  input: EditLessonInput
}

export const editLessonMutation = gql`
  mutation editLesson($input: EditLessonInput!) {
    lesson: editLesson(input: $input) {
      ...lessonInfo
    }
  }
  ${lessonInfoFragment}
`

export default function useEditLessonMutation() {
  return useMutation<EditLessonResponse, EditLessonVariables>(
    editLessonMutation
  )
}
