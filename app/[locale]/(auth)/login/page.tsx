import { env } from '@/env'
import { LoginForm } from './login-form'
import { safeNextPath } from '@/lib/safe-next'
import { Suspense } from 'react'

type LoginPageProps = PageProps<'/[locale]/login'>

const LoginContent = async ({
  searchParams,
}: Pick<LoginPageProps, 'searchParams'>) => {
  const { next } = await searchParams
  return <LoginForm next={safeNextPath(next, env.BETTER_AUTH_URL)} />
}

const LoginPage = ({ searchParams }: LoginPageProps) => {
  return (
    <Suspense fallback={null}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  )
}

export default LoginPage
