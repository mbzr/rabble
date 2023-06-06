import styled from 'styled-components'

export const StyledField = styled.div`
  position: relative;
  margin-bottom: 10px;
`

export const StyledLabel = styled.label`
  display: block;
`

export const StyledError = styled.div``

export const StyledLabelText = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  transition: top 0.2s, font-size 0.2s;
  opacity: 0.5;
  line-height: 24px;
  pointer-events: none;

  &.active {
    top: 8px;
    font-size: 11px;
  }
`

export const StyledButtonWrapper = styled.div`
  display: flex;
  padding: 10px 0 20px;
`

export const StyledFormNote = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 10px;

  a {
    color: #009aef;
  }
`
