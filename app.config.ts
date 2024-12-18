import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  vite: {
    server: {
      port: 4321,
      strictPort: true,
    },
    ssr: { external: ['drizzle-orm'] },
  },
  server: {
    preset: 'deno-server',
  },
  devOverlay: false
})
