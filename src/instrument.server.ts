import * as Sentry from "@sentry/solidstart";

Sentry.init({
	dsn: "https://1249558bccd4c0fac3463d5365ec9ad6@o231594.ingest.us.sentry.io/4508727012032512",
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
});