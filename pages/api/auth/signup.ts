import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { createUser, getUserByEmail } from '@/lib/models/user'
import { EMAIL_ADDRESS_REGEX } from '@/lib/constants'

export default async function signupHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    if (!EMAIL_ADDRESS_REGEX.test(email)) {
      return res.status(400).send({ error: 'Invalid email address.' })
    }

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

    let user
    try {
      user = await createUser({ input: { email, password: hashedPassword } })

      return res.status(201).send(user)
    } catch (err: any) {
      return res.status(503).json({ err: err.toString() })
    }
  }
}
