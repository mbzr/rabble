import styled, { css } from 'styled-components'

import theme from '@/lib/theme'

const placeholderStyles = css`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${theme.colors.grey.main};
`

export const StyledInput = styled.input`
  background: none;
  border: 1px solid ${theme.colors.grey.main};
  outline: 0;
  box-shadow: none;
  border-radius: 50px;

  width: 100%;
  height: 55px;

  background-color: ${theme.colors.grey.light};
  color: inherit;
  font-weight: bold;
  font-size: 16px;
  padding-top: 18px;
  padding-left: 15px;

  ::placeholder,
  ::-webkit-input-placeholder {
    ${placeholderStyles};
  }
  :-ms-input-placeholder {
    ${placeholderStyles};
  }
`

// export const StyledFieldIcon = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;

//   width: 40px;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `
