import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import LoginForm from '@/components/forms/loginForm'

const LoginPage: NextPage<{}> = ({}) => {
  return (
    <Layout noHeader={true}>
      <LoginForm />
    </Layout>
  )
}

export default LoginPage
