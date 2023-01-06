import { gql } from '@apollo/client'

export const courseInfoFragment = gql`
  fragment courseInfo on Course {
    id
    name
    slug
    description
    createdAt
    isPublished
    isArchived
    coverPhoto
    vimeoFolderUri
    level
    lessons {
      id
      name
      slug
      isPublished
      video {
        id
      }
    }
  }
`
