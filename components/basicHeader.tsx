import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import Logo from '@/components/logo'
import { PrimaryButton } from '@/components/button'

const StyledBasicHeader = styled.header`
  position: fixed;
  z-index: 98;
  top: 0;
  left: 0;
  width: 100vw;
  height: 96px;
  color: #000;
  display: flex;
  align-items: center;

  .basic-header-logo {
    position: relative;
    left: 15px;

    @media (min-width: 768px) {
      left: 60px;
    }
  }

  .basic-header-links {
    position: absolute;
    right: 15px;

    @media (min-width: 768px) {
      right: 60px;
    }

    a {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
    }
  }
`

const BasicHeader: React.FC<{}> = () => {
  const router = useRouter()

  return (
    <StyledBasicHeader>
      <Link href="/" className="basic-header-logo">
        <Logo />
      </Link>

      <div className="basic-header-links">
        {router.pathname === '/signup' ? (
          <Link href="/login">Login</Link>
        ) : (
          <Link href="/signup">Register</Link>
        )}
      </div>
    </StyledBasicHeader>
  )
}

export default BasicHeader
