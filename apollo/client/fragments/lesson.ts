import { gql } from '@apollo/client'

import { courseInfoFragment } from './course'

export const lessonInfoFragment = gql`
  fragment lessonInfo on Lesson {
    id
    createdAt
    modifiedAt
    name
    slug
    description
    isPrivate
    isArchived
    course {
      ...courseInfo
    }
    video {
      id
      uri
      width
      height
      size
    }
  }
  ${courseInfoFragment}
`
