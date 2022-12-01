import { unstable_getServerSession } from 'next-auth'
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]'

export async function getServerSession(ctx: any): Promise<any> {
  if (typeof window !== 'undefined') return null

  if (!ctx.req) return null

  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    nextAuthOptions
  )

  return session
}
