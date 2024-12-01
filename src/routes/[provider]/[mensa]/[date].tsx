import { createAsync, type RouteDefinition, useParams } from '@solidjs/router'
import { createEffect, createMemo, createResource, createSignal, For, Show, Suspense } from 'solid-js'
import { getMensa, getMensas, getServings } from '~/api'
import { Header } from '~/components/Header'
import { HeaderMensa } from '~/components/HeaderMensa'
import { Serving } from '~/components/Serving'

export default function Home() {
  const params = useParams()
  // Parse Date from format: "DD-MM-YYYY"
  function parseDate(date: string): string {
    const [day, month, year] = date.split('-')
    // '2024-10-10 22:00:00+00'

    return `${year}-${month}-${day}`
  }
  const [servings] = createResource(() => {
    return {
      mensaSlug: params.mensa,
      date: parseDate(params.date),
      language: 'de' as const,
    }
  }, getServings, {
    deferStream: true,
  })

  const mensa = createAsync(() => getMensa(params.mensa), {
    deferStream: true,
  })

  return (
    <main class='h-full min-h-screen w-full font-bespoke'>
      <HeaderMensa mensa={mensa()?.mensa} />

      <div class='flex gap-3 mx-auto max-w-5xl p-4'>
        <For each={[0, 1]}>
          {(j) => (
            <div class='flex basis-1/2 flex-col gap-3'>
              <Suspense fallback={<div>Loading...</div>}>
                <For
                  each={servings()}
                  fallback={
                    <div>
                      Loading...
                    </div>
                  }
                >
                  {(serving, i) =>
                    i() %
                    2 ===
                    j &&
                    (
                      <Serving
                        name={serving
                          .recipe.name}
                        priceStudents={serving
                          .recipe
                          .price_students}
                        priceEmployees={serving
                          .recipe
                          .price_employees}
                        priceGuests={serving
                          .recipe
                          .price_guests}
                        features={serving
                          .features}
                      />
                    )}
                </For>
              </Suspense>
            </div>
          )}
        </For>
      </div>
    </main>
  )
}
