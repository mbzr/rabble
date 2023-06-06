import React from 'react'
import { NextPage } from 'next'

import Layout from '@/components/layout'
import { withApollo } from '@/apollo/withApollo'
import HeroSection from '@/components/sections/heroSection'
import FaqSection from '@/components/sections/faqSection'
import CtaSection from '@/components/sections/ctaSection'

const HomePage: NextPage<{}> = ({}) => {
  return (
    <Layout>
      <HeroSection />
      <FaqSection />
      <CtaSection />
    </Layout>
  )
}

export default withApollo()(HomePage)
