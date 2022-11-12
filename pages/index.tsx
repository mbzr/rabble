import React from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import { PrimaryButton } from '@/components/button'
import { withApollo } from '@/apollo/withApollo'
import theme from '@/lib/theme'

export const Intro = styled.section`
  background: ${theme.colors.gradient};
  color: ${theme.colors.common.white};
  min-height: calc(100vh - 125px);

  display: flex;
  justify-content: center;
  align-items: center;
`

export const Content = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;

  h1 {
    font-weight: bold;
    font-size: 95px;
    line-height: 1.15;
    text-align: center;
    letter-spacing: 0.2px;
  }

  p {
    font-size: 24px;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 30px;
  }
`

export const Button = styled(PrimaryButton)`
  width: 300px;
`

const HomePage: NextPage<{}> = ({}) => {
  return (
    <Layout>
      <Intro>
        <Content>
          <h1>
            Our experts work with
            <br /> you for best results.
          </h1>
          <p>to design a tailored transformation deliver next-level business</p>
          <Button to="/courses" size="large">
            Explore our courses
          </Button>
        </Content>
      </Intro>
    </Layout>
  )
}

export default withApollo()(HomePage)
