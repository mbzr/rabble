import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'styled-components'

// import GlobalStyles from '@/lib/theme/reset.css'
import theme from '@/lib/theme'
import '../styles/tailwind.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        {/* <GlobalStyles /> */}

        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
