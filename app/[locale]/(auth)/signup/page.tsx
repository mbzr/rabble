import { safeNextPath } from '@/lib/safe-next'
import { SignupForm } from './signup-form'
import { env } from '@/env'
import { Suspense } from 'react'

type SignupPageProps = PageProps<'/[locale]/signup'>

const SignupContent = async ({
  searchParams,
}: Pick<SignupPageProps, 'searchParams'>) => {
  const { next } = await searchParams
  return <SignupForm next={safeNextPath(next, env.BETTER_AUTH_URL)} />
}

const SignupPage = ({ searchParams }: SignupPageProps) => (
  <Suspense fallback={null}>
    <SignupContent searchParams={searchParams} />
  </Suspense>
)

export default SignupPage
