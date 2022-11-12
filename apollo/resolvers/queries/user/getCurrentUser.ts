import { getUserById } from '@/lib/models/user'

export default async (_: any, __: any, ctx: any) => {
  const { user } = ctx
  if (!user || !user.id) return null

  const dbUser = await getUserById(user.id)
  if (!dbUser || dbUser.bannedAt) return null
  return dbUser
}
