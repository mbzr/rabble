import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

import GlobalStyles from '@/lib/theme/reset.css'
import theme from '@/lib/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <Component {...pageProps} />
    </ThemeProvider>
  )
}
