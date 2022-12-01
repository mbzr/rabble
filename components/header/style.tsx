import styled from 'styled-components'

import theme from '@/lib/theme'
import Link from 'next/link'

export const StyledHeader = styled.header`
  background-color: ${theme.colors.brand.dark};
  color: ${theme.colors.common.white};
`

export const Inner = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SideButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

export const LoginAnchor = styled(Link)`
  background: none;
  border: none;
  box-shadow: 0 0 0 transparent;
  outline: none;

  color: ${theme.colors.common.white};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  cursor: pointer;
`
