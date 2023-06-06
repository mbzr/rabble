import Link from 'next/link'
import React from 'react'

import {
  StyledButton,
  StyledAnchorLink,
  StyledRouterLink,
  StyledPrimaryButton,
  StyledWhiteButton,
} from './style'

type To = {
  pathname?: string
  search?: string
  state?: object
}

export type Size = 'small' | 'medium' | 'large' | 'full'

export type Type = 'button' | 'submit'

interface ButtonProps {
  target?: string
  href?: string
  to?: string | To
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  size?: Size
  type?: Type
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const handleAnchorWrapping = (
  Component: React.FC<any>,
  props: Omit<ButtonProps, 'size'>
) => {
  const { href, to, target, children, disabled, isLoading, type, ...rest } =
    props

  const button = (
    <Component
      type={type || 'button'}
      disabled={disabled || isLoading}
      {...rest}
    >
      {children}
    </Component>
  )

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <StyledAnchorLink
          target={target || '_blank'}
          rel={!target ? 'noopener noreferrer' : undefined}
        >
          {button}
        </StyledAnchorLink>
      </Link>
    )
  }

  if (to) return <StyledRouterLink href={to}>{button}</StyledRouterLink>

  return button
}

export const Button: React.FC<ButtonProps> = (props) =>
  handleAnchorWrapping(StyledButton, props)

export const PrimaryButton: React.FC<ButtonProps> = (props) =>
  handleAnchorWrapping(StyledPrimaryButton, props)

export const WhiteButton: React.FC<ButtonProps> = (props) =>
  handleAnchorWrapping(StyledWhiteButton, props)
