export enum Role {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  MEMBER = 'MEMBER',
}

export type UserSettingsType = {
  notifications: {
    newsletter: boolean
  }
}

export type ProviderUserInfo = {
  providerId: string
  displayName: string
  email: string
  rawId: string
  profilePhoto: string
}

export interface User {
  id: string
  displayName: string
  email: string
  emailVerified: boolean
  profilePhoto: string
  providerUserInfo: ProviderUserInfo[]
  createdAt: Date
  modifiedAt: Date
  lastLoginAt: Date
  timezone: number
  password: string
  passwordUpdatedAt: Date
  role: Role
  settings: UserSettingsType
}

export type UserInfoType = Pick<
  User,
  'id' | 'displayName' | 'email' | 'profilePhoto' | 'createdAt'
>

export type LoginPayload = Pick<User, 'email' | 'password'>

export type SignUpPayload = Pick<User, 'email' | 'password'>

export type GetCurrentUserSettingsType = UserInfoType & {
  settings: UserSettingsType
}

export type EditUserType = {
  displayName?: string
  email?: string
  file?: object
}

export type ChangePasswordType = {
  currentPassword: string
  newPassword: string
  newPassword2: string
}
