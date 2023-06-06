import Link from 'next/link'
import styled, { css } from 'styled-components'

import theme from '@/lib/theme'
import { Size } from './index'

export const StyledAnchorLink = styled.a`
  display: inline-flex;
  align-items: center;
  flex: none;
`

export const StyledRouterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex: none;
`

interface ButtonProps {
  size: Size
  disabled: boolean
}

export const StyledButton = styled.button<ButtonProps>`
  background: none;
  border: none;
  outline: none;
  border-radius: 0;

  color: ${theme.colors.bodyColor};
  font-size: 18px;
  font-weight: 600;

  display: inline-flex;
  flex: none;
  justify-content: center;
  align-items: center;
  text-align: center;
  letter-spacing: 0.2px;
  border-radius: 50px;
  width: ${({ size }) =>
    size == 'large' ? '200px' : size == 'full' ? '100%' : '150px'};
  height: 55px;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: default;
    `}
`

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: ${theme.colors.brand.main};
  color: ${theme.colors.common.white};
`

export const StyledSecondaryOutlineButton = styled(StyledButton)`
  border: 1px solid ${theme.colors.grey.main};
`

export const StyledWhiteButton = styled(StyledButton)`
  background-color: ${theme.colors.common.white};
  color: ${theme.colors.bodyColor};
`
