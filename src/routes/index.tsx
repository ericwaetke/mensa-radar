import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMensas } from "~/api";

export const route = {
  preload() {
    getMensas();
  }
} satisfies RouteDefinition;

export default function Home() {
  const mensas = createAsync(async () => getMensas(), { deferStream: true });
  return (
    <main class="w-full p-4 space-y-2">
      <For each={mensas()} fallback={<div>Loading...</div>}>
        {(mensa) => (
          <a class="p-4 bg-white rounded-lg shadow-md block" href={`swp/${mensa.slug}/10-09-2024`}>
            <h4 class="font-bold text-lg">{mensa.name}</h4>
            <p>{mensa.address_city}</p>
          </a>
        )}
        </For>

    </main>
  );
}
