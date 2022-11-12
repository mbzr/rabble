import { createGlobalStyle } from 'styled-components'
import { reset } from 'styled-reset'

import theme from './index'

const GlobalStyles = createGlobalStyle`
  ${reset};

  *, 
  *:before, 
  *:after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;

    /* For crisp font */
    -webkit-text-size-adjust: none;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-font-smoothing: antialiased;
    color: ${theme.colors.bodyColor};
    font-size: 16px;
    font-family: ${theme.bodyFont};
  } 

  * {
    /* Remove tap highlight on iOS */
    -webkit-tap-highlight-color: transparent;

    margin: 0;
    padding: 0;
  }

  /* Input field reset */
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  a,
  img,
  li,
  span {
    display: block;
  }

  li,
  ul {
    list-style: none;
  }

  a {
    color: currentColor;
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
  }

  textarea {
    resize: none;
  }

  pre {
    /* Overflow by default is bad. */
    white-space: pre-wrap;
  }

  img {
    border-style: none;
    /* Remove the border on images inside links in IE 10 and earlier. */
    vertical-align: bottom;
    /* Fix problem with images having a tiny gap for a descender under them. */
    display: block;
    /* Switch display mode to block, since that's what we usually want for images. */
    max-width: 100%;
    /* Make images flexible by default. */
    height: auto;
  }
`

export default GlobalStyles
