import React from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { toast } from 'react-toastify'
import '../scss/custom.css'
import 'react-toastify/dist/ReactToastify.css'
import GlobalStyle from '../styles/global'
import theme from '../styles/theme'
import { Layout } from '../components/Layout'
import { UserAuthenticationProvider } from '../context/userAuthentication'

toast.configure()

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <UserAuthenticationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserAuthenticationProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default MyApp
