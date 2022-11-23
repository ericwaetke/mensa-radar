// import App from 'next/app'
import "../assets/css/app.css"
import {Toaster} from "react-hot-toast"
import { Analytics } from '@vercel/analytics/react';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
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
  