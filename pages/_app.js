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
		<NextNProgress color="#88E2A1"/>
		<Toaster />

		<PlausibleProvider domain="mensa-radar.de" customDomain="https://analytics.ericwaetke.de" selfHosted="true">
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
