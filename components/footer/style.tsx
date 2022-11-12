import styled from 'styled-components'

import theme from '@/lib/theme'

export const StyledFooter = styled.footer`
  background-color: ${theme.colors.brand.dark};
  color: ${theme.colors.common.white};

  p,
  a {
    font-size: 15px;
    font-weight: normal;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 15px;
  }
`

export const Inner = styled.div`
  padding: 16.25px 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
`
