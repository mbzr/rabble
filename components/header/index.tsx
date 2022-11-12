import React from 'react'
import Link from 'next/link'
import { useApolloClient } from '@apollo/client'

import { Container } from '@/components/globals'
import Logo from '@/components/logo'
import { PrimaryButton } from '@/components/button'
import useCurrentUser from '@/apollo/client/queries/user/useCurrentUser'
import { StyledHeader, Inner, SideButtons, LoginAnchor } from './style'
import { useModal } from '../modals/modalContext'
import useApi from '@/lib/hooks/useApi'

const Header: React.FC<{}> = () => {
  const client = useApolloClient()
  const { data, loading } = useCurrentUser()
  const { dispatch } = useModal()
  const [, callApi] = useApi()

  const handleLogout = async () => {
    try {
      await callApi('/api/auth/logout')

      client.clearStore().then(() => {
        window.location.href = '/'
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <StyledHeader>
      <Container>
        <Inner>
          <Logo />

          <SideButtons>
            {loading ? <div>Loading...</div> : ''}
            {data?.user ? (
              <>
                <Link href="/account">Hi, {data.user.displayName}</Link>
                <PrimaryButton onClick={handleLogout} target="_self">
                  Logout
                </PrimaryButton>
              </>
            ) : (
              <>
                <LoginAnchor
                  onClick={() =>
                    dispatch({ type: 'OPEN_MODAL', modalType: 'LOGIN_MODAL' })
                  }
                >
                  Login
                </LoginAnchor>
                <PrimaryButton
                  onClick={() =>
                    dispatch({ type: 'OPEN_MODAL', modalType: 'SIGNUP_MODAL' })
                  }
                >
                  Sign up
                </PrimaryButton>
              </>
            )}
          </SideButtons>
        </Inner>
      </Container>
    </StyledHeader>
  )
}

export default Header
