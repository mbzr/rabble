import { gql } from '@apollo/client'

export default gql`
  fragment userInfo on User {
    id
    displayName
    email
    profilePhoto
    createdAt
  }
`
