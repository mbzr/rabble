import React from 'react'

import Link from 'next/link'
import styled from 'styled-components'

export const StyledLogo = styled(Link)`
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: center;
  letter-spacing: 0.1px;

  color: #ffffff;
`

const Logo: React.FC<{}> = () => {
  return <StyledLogo href="/">rabble. academy</StyledLogo>
}

export default Logo
