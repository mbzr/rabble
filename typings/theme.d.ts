import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    bodyFont: string
    colors: {
      bodyColor: string
      primary: string
      common: {
        black: string
        white: string
      }
      grey: {
        light: string
        main: string
        dark: string
      }
      brand: {
        light: string
        main: string
        dark: string
      }
      gradient: string
    }
  }
}
