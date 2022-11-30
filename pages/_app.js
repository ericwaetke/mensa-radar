// import App from 'next/app'
import "../assets/css/app.css"
import {Toaster} from "react-hot-toast"
import { Analytics } from '@vercel/analytics/react';
import NextNProgress from 'nextjs-progressbar';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import '../assets/css/react-spring-bottom-sheet.css'


function MyApp({ Component, pageProps }) {
	if (typeof window !== 'undefined') {
		LogRocket.init('x4o9cp/mensa-radar');
		// plugins should also only be initialized when in the browser
		setupLogRocketReact(LogRocket);
		
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
		<Component {...pageProps} />
		<Analytics />
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
  