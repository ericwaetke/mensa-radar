// @refresh reload
import * as Sentry from "@sentry/solidstart"
import { solidRouterBrowserTracingIntegration } from "@sentry/solidstart/solidrouter"
import { mount, StartClient } from "@solidjs/start/client"

Sentry.init({
	dsn: "https://1d2fcc691c0c8ca9556f1fcf42f434fa@o4508727023632384.ingest.de.sentry.io/4508727024746576",
	integrations: [
		solidRouterBrowserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: ["localhost", /^https:\/\/mensa-radar\.de/],
	// Session Replay
	replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

mount(() => <StartClient />, document.getElementById("app")!)
