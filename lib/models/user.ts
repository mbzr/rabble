import db from '../db'
import { CreateUserType, EditUserType } from '../types/user'
import { uploadImage } from '../utils/file-upload'

export const createUser = async ({ input }: { input: CreateUserType }) => {
  const { email, password } = input

  const displayName = email.substring(0, email.lastIndexOf('@'))

  const res = await db('users').returning('*').insert({
    email,
    displayName,
    password,
    profilePhoto: null,
    modifiedAt: null,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    bannedAt: null,
    passwordUpdatedAt: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: 'MEMBER',
  })

  return (res && res[0]) || null
}

export const getUserByEmail = async (email: string) => {
  const rows = await db('users').where({ email })

  return (rows && rows[0]) || null
}

export const getUserById = async (id: string) => {
  const rows = await db('users').where({ id })

  return (rows && rows[0]) || null
}

export const editUser = async (
  { input }: { input: EditUserType },
  userId: string
) => {
  const { displayName, email, file } = input

  return await db('users')
    .where({ id: userId })
    .then((result: any) => {
      // console.log('result', result)
      if (!result) {
        throw Error('No user found.')
      }

      return Object.assign({}, result[0], {
        displayName,
        email,
        modifiedAt: new Date(),
      })
    })
    .then((user: any) => {
      // console.log('backend file', file)
      if (file) {
        return uploadImage(file, 'users', user.id)
          .then((profilePhoto) => {
            // update the user with the profilePhoto
            return db('users')
              .where({ id: user.id })
              .update({
                ...user,
                profilePhoto,
              })
              .then((res: any) => (res && res[0]) || null)
          })
          .catch((err: any) => console.error(err))
      } else {
        return db('users')
          .where({ id: user.id })
          .update({
            ...user,
          })
          .then((res: any) => (res && res[0]) || null)
      }
    })
}

export const changePassword = (args: any, userId: string) => {
  const { newPassword } = args.input

  return db('users')
    .where({ id: userId })
    .then((result) => {
      // console.log('result', result[0])
      return Object.assign({}, result[0], {
        password: newPassword,
        modifiedAt: new Date(),
        passwordUpdatedAt: new Date(),
      })
    })
    .then((user: any) => {
      // console.log('user', user)
      return db('users')
        .where({ id: user.id })
        .update({
          ...user,
        })
        .then((res: any) => (res && res[0]) || null)
    })
}

export const createUserSettings = async (userId: string) => {
  const res = await db('users_settings')
    .returning('*')
    .insert({
      userId,
      notifications: {
        newsletter: true,
      },
    })
  // console.log('createUserSettings', res)
  return (res && res[0]) || null
}

export const getUserSettings = async (userId: string) => {
  const res = await db('users_settings').where({ userId })

  if (res && res.length > 0) {
    return res[0]
  } else {
    return null
  }
}

export const updateUserSettings = (userId: string, settings: object) => {
  return db('users_settings')
    .where({ userId })
    .update({
      ...settings,
    })
    .then((res: any) => (res && res[0]) || null)
}
