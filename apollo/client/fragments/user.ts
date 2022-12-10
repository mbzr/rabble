import { gql } from '@apollo/client'

export const userInfoFragment = gql`
  fragment userInfo on User {
    id
    displayName
    email
    profilePhoto
    createdAt
    role
    timezone
  }
`

export const userSettingsFragment = gql`
  fragment userSettings on User {
    settings {
      notifications {
        newsletter
      }
    }
  }
`
