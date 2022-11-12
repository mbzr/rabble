import { createUserSettings, getUserSettings } from '@/lib/models/user'

export default async (_: any, __: any, { user }: any) => {
  if (!user) return new Error('You must be signed in to continue.')

  const settings = await getUserSettings(user.id)
  if (settings) return settings
  return await createUserSettings(user.id)
}
