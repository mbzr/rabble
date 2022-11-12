import { gql } from '@apollo/client'

export default gql`
  fragment userSettings on User {
    settings {
      notifications {
        newsletter
      }
    }
  }
`
