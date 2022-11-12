import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import auth from '@/lib/middlewares/auth'
import passport from '@/lib/auth/passport'

const handler = nextConnect()

handler
  .use(auth)
  .post(
    passport.authenticate('local'),
    (req: NextApiRequest, res: NextApiResponse) => {
      return res.send(req.user)
    }
  )

export default handler
