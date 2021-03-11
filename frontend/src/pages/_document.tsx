import React from 'react'
import Document, {
  DocumentInitialProps,
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import favicon from '../assets/favicon.ico'
import favicon16 from '../assets/favicon-16x16.png'
import favicon32 from '../assets/favicon-32x32.png'
import faviconApple from '../assets/apple-touch-icon.png'
export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="pt">
        <Head>
          <meta charSet="utf-8" />

          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,500,700"
            rel="stylesheet"
          />

          <link rel="icon" href={favicon} />

          <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />

          <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />

          <link rel="apple-touch-icon" sizes="180x180" href={faviconApple} />

          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <style jsx global>{`
            /* Other global styles such as 'html, body' etc... */

            #__next {
              min-height: 100vh;
            }
          `}</style>
        </body>
      </Html>
    )
  }
}
