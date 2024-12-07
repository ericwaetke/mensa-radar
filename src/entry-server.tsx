// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

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
