import React from 'react'
import { StyledNav, Anchor } from './style'

const Nav: React.FC<{}> = () => {
  return (
    <StyledNav>
      <Anchor href="/courses">Courses</Anchor>
    </StyledNav>
  )
}

export default Nav
