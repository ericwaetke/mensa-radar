// import App from 'next/app'
import "../assets/css/app.css"
import {Toaster} from "react-hot-toast"
import PlausibleProvider from 'next-plausible'
import NextNProgress from 'nextjs-progressbar';
import '../assets/css/react-spring-bottom-sheet.css'
import 'react-tooltip/dist/react-tooltip.css'
import { Provider } from 'react-wrap-balancer'
import "@total-typescript/ts-reset";
import "@total-typescript/ts-reset";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	if (typeof window !== 'undefined') {
		const appHeight = () => {
			const doc = document.documentElement
			doc.style.setProperty('--app-height', `${window.innerHeight}px`)
		}
		window.addEventListener('resize', appHeight)
		appHeight()
	}
	return (
		<>
		<Head>
			<meta name="theme-color" content="#E2EEE3" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
		</Head>
		<NextNProgress color="#88E2A1"/>
		<Toaster />

		<PlausibleProvider domain="mensa-radar.de" customDomain="https://plausible.wovenspace.xyz" selfHosted="true">
			<Provider>
				<Component {...pageProps} />
			</Provider>
		</PlausibleProvider>
		</>
	)
}

  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // MyApp.getInitialProps = async (appContext) => {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

export default MyApp
