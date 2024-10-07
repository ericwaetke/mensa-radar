import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMensas, getServings } from "~/api";

export const route = {
  preload() {
    getServings();
  }
} satisfies RouteDefinition;

export default function Home() {
  const params = useParams();
  const servings = createAsync(async () => getServings(params.mensa), { deferStream: true });
  return (
    <main class="w-full p-4 space-y-2">
      <For each={servings()} fallback={<div>Loading...</div>}>
        {(serving) => (
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold">{serving.servings.date}</h2>
            <p class="text-gray-500">{serving.recipes_locales?._locale}</p>
          </div>
        )}
        </For>

    </main>
  );
}
