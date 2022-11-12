import nextConnect from 'next-connect'

import passport from '@/lib/auth/passport'
import session from '@/lib/auth/session'

const MAX_AGE = 24 * 60 * 60 * 1000 * 30 // 1 month

const auth = nextConnect()
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session())
// .use((req, res, next) => {
//   console.log('user', req.user)
//   next()
// })

export default auth
