import styled from 'styled-components'

import theme from '@/lib/theme'
import Link from 'next/link'

export const StyledHeader = styled.header<{ styled: any }>`
  background-color: ${theme.colors.brand.dark};
  color: ${theme.colors.common.white};

  position: absolute;
  top: 0px;
  z-index: 9999;
  width: 100%;
  height: 96px;
  transition: background 0.3s, transform 0.3s;
  transform: translateY(0);
  background-blend-mode: multiply;
  background: ${(props) =>
    props.styled.light
      ? 'linear-gradient(180deg,rgba(16, 20, 31, 0.8) 0.98%,rgba(16, 20, 31, 0.4) 59.23%,rgba(16, 20, 31, 0.2) 78.16%,rgba(16, 20, 31, 0.0001) 96.12%)'
      : '#1c1f29'};

  &.is-sticky {
    transform: translateY(-100%);
    /* background: #1c1f29; */
  }
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
