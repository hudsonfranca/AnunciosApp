import React from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { toast } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import GlobalStyle from '../styles/global'
import theme from '../styles/theme'
import { Layout } from '../components/Layout'

toast.configure()
const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>

      <GlobalStyle />
    </ThemeProvider>
  )
}

export default MyApp
