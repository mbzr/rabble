import bcrypt from 'bcryptjs'

import { ensureAuthenticated } from '@/lib/utils/permissions'
import { changePassword, getUserByEmail } from '@/lib/models/user'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const { input } = args
  const { user: ctxUser } = ctx

  const user: any = await getUserByEmail(ctxUser.email)

  if (!user) {
    throw new Error('No user found')
  }

  const valid = await bcrypt.compare(input.currentPassword, user.password)

  if (!valid) {
    return new Error('Incorrect password provided')
  }

  const salt = await bcrypt.genSalt(10)
  const newPasswordHashed = await bcrypt.hash(input.newPassword, salt)

  return await changePassword(
    { input: { newPassword: newPasswordHashed } },
    user.id
  )
    .then(() => true)
    .catch((err: any) => new Error(err.message))
})
