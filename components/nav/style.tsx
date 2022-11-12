import Link from 'next/link'
import styled from 'styled-components'

export const StyledNav = styled.nav`
  display: flex;
  align-item: center;
  justify-content: flex-start;
  gap: 15px;
`

export const Anchor = styled(Link)`
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.2px;
`
