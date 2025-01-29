import { defineConfig } from '@solidjs/start/config'
import { sentrySolidStartVite, withSentry } from '@sentry/solidstart';

export default defineConfig(
  withSentry({
    vite: {
      server: {
        port: 4321,
        strictPort: true,
      },
      ssr: { external: ['drizzle-orm'] },
      plugins: [

      ]
    },
    middleware: "./src/middleware.ts",
    // server: {
    //   preset: '',
    // },
    devOverlay: false
  },
    {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      debug: true,
    })
)
