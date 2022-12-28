import { gql } from '@apollo/client'

const User = gql`
  input UserProviderInfoInput {
    providerId: String!
    displayName: String!
    email: Email!
    rawId: String!
    profilePhoto: String!
  }

  type UserProviderInfo @cacheControl(maxAge: 600) {
    providerId: String!
    displayName: String!
    email: Email!
    rawId: String!
    profilePhoto: String!
  }

  type UserNotificationsSettings @cacheControl(maxAge: 600) {
    newsletter: Boolean
  }

  type UserSettings @cacheControl(maxAge: 600) {
    notifications: UserNotificationsSettings
  }

  type User @cacheControl(maxAge: 600) {
    id: ID!
    displayName: String
    email: Email!
    emailVerified: Boolean
    profilePhoto: String
    providerUserInfo: [UserProviderInfo!]
    createdAt: Date
    modifiedAt: Date
    lastLoginAt: Date
    bannedAt: Date
    timezone: String
    password: String
    passwordUpdatedAt: Date
    role: Role
    settings: UserSettings
  }

  input EditUserInput {
    displayName: String
    email: Email
    file: Upload
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
    newPassword2: String!
  }

  input UpdateUserNotificationSettingsInput {
    shouldSendNewsletter: Boolean
  }

  extend type Query {
    currentUser: User @cacheControl(maxAge: 1200, scope: PRIVATE)
  }

  extend type Mutation {
    editUser(input: EditUserInput!): User
    changePassword(input: ChangePasswordInput!): Boolean!
    updateUserNotificationSettings(
      input: UpdateUserNotificationSettingsInput!
    ): User
  }
`

export default User
