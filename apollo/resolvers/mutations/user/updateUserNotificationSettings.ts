import {
  getUserSettings,
  updateUserSettings,
  getUserById,
} from '@/lib/models/user'
import { ensureAuthenticated } from '@/lib/utils/permissions'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const { user } = ctx
  const { shouldSendNewsletter } = args.input

  const { id, userId, ...settings } = await getUserSettings(user.id)

  let newSettings = Object.assign({}, settings, {
    ...settings,
  })

  newSettings.notifications.newsletter = shouldSendNewsletter

  return await updateUserSettings(user.id, newSettings).then(() =>
    getUserById(user.id)
  )
})
