// @refresh reload
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import './bespoke-slab.css'
import '@fontsource-variable/noto-sans'
import { readFileSync } from 'fs'

export default function App() {
  console.log(process.env.POSTGRES_PASSWORD_FILE
    ? readFileSync(process.env.POSTGRES_PASSWORD_FILE, "utf8")
    : undefined)
  return (
    <Router
      root={(props) => (
        <>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
