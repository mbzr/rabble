import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import auth from '@/lib/middlewares/auth'

const handler = nextConnect()

handler.use(auth).get((req: NextApiRequest, res: NextApiResponse) => {
  req.logout()
  return res.send({ success: true })
})

export default handler
