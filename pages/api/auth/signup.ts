import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import bcrypt from 'bcryptjs'

import auth from '@/lib/middlewares/auth'
import { createUser, getUserByEmail } from '@/lib/models/user'

const handler = nextConnect()

handler.use(auth).post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({ error: 'Missing fields' })
  }

  if (await getUserByEmail(email)) {
    return res
      .status(409)
      .send({ error: `User with email ${email} already exists` })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  let user: any

  try {
    user = await createUser({ input: { email, password: hashedPassword } })

    req.login(user, function (err: any) {
      if (err) throw err

      // console.log('Successfully logged in!')

      res.status(201).send(user)
    })
    // console.log('signup', user)
  } catch (err) {
    console.error(err)
  }
})

export default handler
