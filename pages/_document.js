import Document, { Html, Head, Main, NextScript } from 'next/document'
import {Toaster} from "react-hot-toast"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sen:wght@800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital@0;1&display=swap" rel="stylesheet" /> 

            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
            <meta name="theme-color" content="#88E2A1" />
        </Head>
        {/* <body style={{background: '#E5E7E5'}}> */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument