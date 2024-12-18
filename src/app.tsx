// @refresh reload
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import "./app.css"
import "./bespoke-slab.css"
import "@fontsource-variable/noto-sans"

export default function App() {
	return (
		<Router
			root={(props) => (
				<>
					<Suspense>{props.children}</Suspense>
				</>
			)}>
			<FileRoutes />
		</Router>
	)
}
