import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
	vite: {
		server: {
			port: 3333,
		},
		ssr: { external: ['drizzle-orm'] },
	},
})
