import bcrypt from 'bcryptjs'

import { ensureAuthenticated } from '@/lib/utils/helpers'
import { changePassword } from '@/lib/models/user'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const { input } = args
  const { user } = ctx

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
