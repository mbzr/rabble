export enum Role {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  MEMBER = 'MEMBER',
}

export type RoleStrings = keyof typeof Role

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
  profilePhoto: string | null
  createdAt: Date
  modifiedAt: Date | null
  lastLoginAt: Date | null
  timezone: string
  password: string
  passwordUpdatedAt: Date | null
  bannedAt: Date | null
  role: RoleStrings
  settings: UserSettingsType
}

export type UserInfoType = Pick<
  User,
  'id' | 'displayName' | 'email' | 'profilePhoto' | 'createdAt' | 'role'
>

export type LoginPayload = Pick<User, 'email' | 'password'>

export type SignUpPayload = Pick<User, 'email' | 'password'>

export type GetCurrentUserSettingsType = UserInfoType & {
  settings: UserSettingsType
}

export type CreateUserType = {
  email: string
  password: string
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
