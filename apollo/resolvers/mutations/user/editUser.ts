import { EMAIL_ADDRESS_REGEX } from '@/lib/constants'
import { editUser, getUserByEmail } from '@/lib/models/user'
import { ensureAuthenticated } from '@/lib/auth/helpers'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const { user } = ctx
  const { input } = args

  const inputEmail = input.email

  if (inputEmail && typeof inputEmail === 'string') {
    if (inputEmail !== user.email || !user.email) {
      if (!EMAIL_ADDRESS_REGEX.test(inputEmail)) {
        return new Error('Please enter a valid email address')
      }

      const dbUser = await getUserByEmail(inputEmail)
      if (dbUser) {
        return new Error('User with email already exists')
      }
    }
  }

  return await editUser(args, user.id)
})
