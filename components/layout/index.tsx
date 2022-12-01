import React from 'react'
import styled from 'styled-components'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Head from '@/components/head'
import { ModalProvider, ModalRoot } from '@/components/modals/modalContext'

interface LayoutProps {
  children: React.ReactNode
  noHeader?: boolean
}

export const StyledLayout = styled.main``

const Layout: React.FC<LayoutProps> = ({ children, noHeader }) => {
  return (
    <StyledLayout>
      <Head title="Rabble App" />

      <ModalProvider>
        {noHeader ? null : <Header />}
        <ModalRoot />
        {children}
      </ModalProvider>

      <Footer />
    </StyledLayout>
  )
}

export default Layout
