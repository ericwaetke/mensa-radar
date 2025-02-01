import * as Sentry from "@sentry/solidstart";

Sentry.init({
	dsn: "https://1d2fcc691c0c8ca9556f1fcf42f434fa@o4508727023632384.ingest.de.sentry.io/4508727024746576",
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
});
