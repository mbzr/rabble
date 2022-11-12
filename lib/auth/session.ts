import { serialize } from 'cookie'
import Iron from '@hapi/iron'
import { parse } from 'cookie'
import { NextPageContext } from 'next'

export const SESSION_NAME = 'sess'

export async function createLoginSession(
  session: any,
  secret: Iron.Password | Iron.password.Secret | Iron.password.Specific
): Promise<string> {
  const createdAt = Date.now()
  const obj = { ...session, createdAt }
  const token = await Iron.seal(obj, secret, Iron.defaults)

  return token
}

export async function getLoginSession(
  token: string,
  secret: Iron.Password | Iron.password.Hash
): Promise<any> {
  const session = await Iron.unseal(token, secret, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (session.maxAge && Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  return session
}

export function parseCookies(req: any) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export async function getSessionUser(ctx: NextPageContext): Promise<any> {
  if (typeof window !== 'undefined') return null
  if (!ctx.req) return null

  const cookies = parseCookies(ctx.req)
  const token = cookies[SESSION_NAME]

  if (!token) return

  const req = await getLoginSession(token, process.env.SESSION_SECRET)

  return req.passport.user || null
}

export default function session({
  name = SESSION_NAME,
  secret,
  cookie: cookieOpts,
}: {
  name?: string
  secret: string
  cookie: any
}) {
  return async (req: any, res: any, next: any) => {
    const cookies = parseCookies(req)
    const token = cookies[name]
    let unsealed = {}

    if (token) {
      try {
        // the cookie needs to be unsealed using the password `secret`
        unsealed = await getLoginSession(token, secret)
      } catch (e) {
        // The cookie is invalid
      }
    }

    req.session = unsealed

    // We are proxying res.end to commit the session cookie
    const oldEnd = res.end
    res.end = async function resEndProxy(...args: any[]) {
      if (res.finished || res.writableEnded || res.headersSent) return
      if (cookieOpts.maxAge) {
        req.session.maxAge = cookieOpts.maxAge
      }

      const token = await createLoginSession(req.session, secret)

      res.setHeader('Set-Cookie', serialize(name, token, cookieOpts))
      oldEnd.apply(this, args)
    }

    next()
  }
}
