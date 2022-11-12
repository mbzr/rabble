import React from 'react'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Head from '@/components/head'
import { StyledLayout } from './style'
import { ModalProvider, ModalRoot } from '@/components/modals/modalContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Head title="Rabble App" />

      <ModalProvider>
        <Header />
        <ModalRoot />
        {children}
      </ModalProvider>

      <Footer />
    </StyledLayout>
  )
}

export default Layout
