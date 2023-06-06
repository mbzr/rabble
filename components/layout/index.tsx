import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Head from '@/components/head'
import { ModalProvider, ModalRoot } from '@/components/modals/modalContext'
import BasicHeader from '../basicHeader'

interface LayoutProps {
  children: React.ReactNode
  noHeader?: boolean
}

export const StyledLayout = styled.main``

const Layout: React.FC<LayoutProps> = ({ children, noHeader }) => {
  const router = useRouter()

  return (
    <StyledLayout>
      <Head title="Rabble App" />

      <ModalProvider>
        {['/signup', '/login'].includes(router.pathname) ? (
          <BasicHeader />
        ) : (
          <Header />
        )}
        <ModalRoot />
        {children}
      </ModalProvider>
      <Footer />
    </StyledLayout>
  )
}

export default Layout
