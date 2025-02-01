// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

import * as Sentry from "@sentry/solidstart"

Sentry.init({
	dsn: "https://1d2fcc691c0c8ca9556f1fcf42f434fa@o4508727023632384.ingest.de.sentry.io/4508727024746576",
	tracesSampleRate: 1.0, //  Capture 100% of the transactions,
	registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
})

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="de">
				<head>
					<meta charset="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1 user-scalable=0"
					/>
					<link rel="icon" href="/favicon.svg" />
					<script
						defer
						data-domain="mensa-radar.de"
						src="https://plausible.woven.design/js/script.js"></script>
					{assets}
				</head>
				<body class="bg-[#DDEDE2] font-bespoke">
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
))
