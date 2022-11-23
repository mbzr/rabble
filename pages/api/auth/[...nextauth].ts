import { getUserByEmail } from '@/lib/models/user'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'name@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user: any = await getUserByEmail(credentials.email)

        if (!user) {
          throw new Error('No user found')
        }

        const valid = await bcrypt.compare(credentials.password, user.password)

        if (valid) {
          const {
            id,
            displayName,
            email,
            profilePhoto,
            createdAt,
            role,
            timezone,
          } = user

          return {
            id,
            displayName,
            email,
            profilePhoto,
            createdAt,
            role,
            timezone,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id
        token.user = user
      }

      return token
    },
    session: ({ session, token, user }) => {
      if (token) {
        session.id = token.id
      }

      if (token.user) {
        session.user = token.user
      }

      return session
    },
  },
}

export default NextAuth(nextAuthOptions)
