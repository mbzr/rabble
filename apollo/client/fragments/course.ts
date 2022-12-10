import { gql } from '@apollo/client'

export const courseInfoFragment = gql`
  fragment courseInfo on Course {
    id
    name
    slug
    description
    isPrivate
    createdAt
    isArchived
  }
`
