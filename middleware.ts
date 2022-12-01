import { withAuth } from 'next-auth/middleware'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === '/admin') {
        console.log('token.user.role', token)
        return token?.user?.role === 'ADMIN'
      }

      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin', '/account', '/account/notifications'],
}
