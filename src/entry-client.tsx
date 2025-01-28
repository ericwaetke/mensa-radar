// @refresh reload
import * as Sentry from "@sentry/solidstart"
import { solidRouterBrowserTracingIntegration } from "@sentry/solidstart/solidrouter"
import { mount, StartClient } from "@solidjs/start/client"

Sentry.init({
	dsn: "http://35b2ef5a19fd4d61b8a74bbd88b0e30f@glitchtip.woven.design/1",
	integrations: [solidRouterBrowserTracingIntegration()],
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
})

mount(() => <StartClient />, document.getElementById("app")!)
