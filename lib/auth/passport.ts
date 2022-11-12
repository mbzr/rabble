import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'

import { getUserByEmail } from '@/lib/models/user'

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(async function (user: any, done) {
  done(null, user)
})

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done) => {
      const user = await getUserByEmail(email)

      if (!user) {
        return done(null, false, {
          message: `User with email ${email} does not exist`,
        })
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        return done(null, false, { message: `Incorrect password provided` })
      }

      done(null, user)
    }
  )
)

export default passport
