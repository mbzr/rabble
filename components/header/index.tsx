import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useApolloClient } from '@apollo/client'

import { Container } from '@/components/globals'
import Logo from '@/components/logo'
import { PrimaryButton } from '@/components/button'
import useCurrentUser from '@/apollo/client/queries/user/useCurrentUser'
import { StyledHeader, Inner, SideButtons, LoginAnchor } from './style'

const HeaderUser = () => {
  const client = useApolloClient()
  const { data } = useCurrentUser()

  const handleLogout = async () => {
    try {
      await signOut()

      client.clearStore().then(() => {
        window.location.href = '/'
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (data?.user) {
    return (
      <>
        <Link href="/account">Hi, {data.user.displayName}</Link>
        <PrimaryButton onClick={handleLogout} target="_self">
          Logout
        </PrimaryButton>
      </>
    )
  }

  return null
}

const Header: React.FC<{}> = () => {
  const { data: session } = useSession()

  return (
    <StyledHeader>
      <Container>
        <Inner>
          <Logo />

          <SideButtons>
            {session ? (
              <HeaderUser />
            ) : (
              <>
                <LoginAnchor href="/login">Login</LoginAnchor>
                <PrimaryButton to="/signup">Sign up</PrimaryButton>
              </>
            )}
          </SideButtons>
        </Inner>
      </Container>
    </StyledHeader>
  )
}

export default Header
