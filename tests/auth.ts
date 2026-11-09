import { authOptions } from '@/lib/auth'
import { betterAuth } from 'better-auth'
import { testUtils } from 'better-auth/plugins'
import { setRequestHeaders } from './stubs/next-headers'

const testAuth = betterAuth({
  ...authOptions,
  plugins: [...authOptions.plugins, testUtils()],
})

export const signInAs = async (user: { id: string }) => {
  const { test } = await testAuth.$context
  setRequestHeaders(await test.getAuthHeaders({ userId: user.id }))
}

export const signOut = () => setRequestHeaders(new Headers())
