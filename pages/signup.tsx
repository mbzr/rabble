import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import SignupForm from '@/components/forms/signupForm'

const SignupPage: NextPage<{}> = ({}) => {
  return (
    <Layout noHeader={true}>
      <SignupForm />
    </Layout>
  )
}

export default SignupPage
