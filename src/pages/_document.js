import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html lang='de'>
				<Head>
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/icon-apple-touch.png" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="icon" type="image/png" href="/favicon.png" />
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