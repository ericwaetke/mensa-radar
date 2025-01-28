// @refresh reload
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import "./app.css"
import "./bespoke-slab.css"
import "@fontsource-variable/noto-sans"

import { withSentryRouterRouting } from "@sentry/solidstart/solidrouter"

const SentryRouter = withSentryRouterRouting(Router)

export default function App() {
	return (
		<SentryRouter>
			<Router
				root={(props) => (
					<>
						<Suspense>{props.children}</Suspense>
					</>
				)}>
				<FileRoutes />
			</Router>
		</SentryRouter>
	)
}
