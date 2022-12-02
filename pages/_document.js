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
            <meta name="theme-color" content="#E2EEE3" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="viewport" content="viewport-fit=cover" />
        </Head>
        {/* <body style={{background: '#E5E7E5'}}> */}
        <body className='bg-light-green'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument