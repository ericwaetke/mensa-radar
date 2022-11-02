import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
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